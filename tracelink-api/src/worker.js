require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const prisma = require("./lib/prisma");

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const TIMEOUT_MS = 10000; // 10 seconds
const MAX_REDIRECTS = 10;

// Turns an HTTP status code into the rubric categories we care about.
function classifyStatus(status) {
  if (status >= 200 && status < 300) return "OPERATIONAL";
  if (status === 401 || status === 403) return "RESTRICTED";
  if (status === 404) return "BROKEN";
  if (status >= 400 && status < 500) return "CLIENT_ERROR";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN";
}

// Manually follows redirects ourselves (instead of letting fetch do it
// silently) so we can actually count how many hops happened and report
// the true final URL — both fields our schema stores.
async function checkUrl(url) {
  let currentUrl = url;
  let redirectCount = 0;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    while (redirectCount <= MAX_REDIRECTS) {
      const response = await fetch(currentUrl, {
        redirect: "manual",
        signal: controller.signal,
      });

      // 3xx status with a Location header means "keep following"
      if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.get("location")) {
        redirectCount++;
        currentUrl = new URL(response.headers.get("location"), currentUrl).toString();
        continue;
      }

      clearTimeout(timeout);
      return {
        httpStatus: response.status,
        statusLabel: classifyStatus(response.status),
        finalUrl: currentUrl,
        redirectCount,
        errorType: null,
      };
    }

    clearTimeout(timeout);
    return {
      httpStatus: null,
      statusLabel: "TOO_MANY_REDIRECTS",
      finalUrl: currentUrl,
      redirectCount,
      errorType: "TOO_MANY_REDIRECTS",
    };
  } catch (err) {
    clearTimeout(timeout);
    const errorType = err.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR";
    return {
      httpStatus: null,
      statusLabel: errorType,
      finalUrl: currentUrl,
      redirectCount,
      errorType,
    };
  }
}

// Checks whether every URL in a job now has a result, and if so,
// marks the job COMPLETED. This is what flips the status your
// dashboard will show.
async function maybeCompleteJob(jobId) {
  const job = await prisma.sCAN_JOB.findUnique({ where: { SCN_ID: jobId } });
  const completedCount = await prisma.sCAN_RESULT.count({
    where: { SCAN_JOB_SCN_ID: jobId, RES_CheckedAt: { not: null } },
  });

  if (completedCount >= job.SCN_TotalURLs) {
    await prisma.sCAN_JOB.update({
      where: { SCN_ID: jobId },
      data: { SCN_Status: "COMPLETED", SCN_CompletedAt: new Date() },
    });
  }
}

const worker = new Worker(
  "url-scan",
  async (job) => {
    const { jobId, urlId, url } = job.data;
    console.log(`Checking: ${url}`);

    const result = await checkUrl(url);

    await prisma.sCAN_RESULT.create({
      data: {
        SCAN_JOB_SCN_ID: jobId,
        URL_URL_ID: urlId,
        RES_HTTPStatus: result.httpStatus,
        RES_StatusLabel: result.statusLabel,
        RES_FinalURL: result.finalUrl,
        RES_RedirectCount: result.redirectCount,
        RES_ErrorType: result.errorType,
        RES_CheckedAt: new Date(),
      },
    });

    await maybeCompleteJob(jobId);
  },
  { connection, concurrency: 5 }
);

worker.on("completed", (job) => console.log(`✅ Job ${job.id} done`));
worker.on("failed", (job, err) => console.error(`❌ Job ${job.id} failed:`, err.message));

console.log("Worker Service listening for jobs...");