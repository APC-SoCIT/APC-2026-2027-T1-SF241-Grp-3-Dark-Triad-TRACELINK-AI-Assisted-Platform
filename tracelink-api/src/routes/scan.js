const express = require("express");
const prisma = require("../lib/prisma");
const { scanQueue } = require("../queue/queue");

const router = express.Router();

// POST /api/batches/:batchId/scan
// Creates a SCAN_JOB for a previously-uploaded batch, and publishes one
// task per URL onto the queue. Does NOT do any validation itself —
// that's the Worker Service's job, which we'll build next.
router.post("/batches/:batchId/scan", async (req, res) => {
  const batchId = Number(req.params.batchId);

  const batch = await prisma.uRL_BATCH.findUnique({
    where: { BAT_ID: batchId },
    include: { urls: true },
  });

  if (!batch) {
    return res.status(404).json({ error: "Batch not found" });
  }

  const job = await prisma.sCAN_JOB.create({
    data: {
      URL_BATCH_BAT_ID: batch.BAT_ID,
      SCN_TotalURLs: batch.urls.length,
      SCN_Status: "PROCESSING",
      SCN_StartedAt: new Date(),
    },
  });

  // One task per URL. addBulk keeps this fast even for large batches.
  await scanQueue.addBulk(
    batch.urls.map((url) => ({
      name: "validate-url",
      data: { jobId: job.SCN_ID, urlId: url.URL_ID, url: url.URL_Normalized },
    }))
  );

  await prisma.uRL_BATCH.update({
    where: { BAT_ID: batch.BAT_ID },
    data: { BAT_Status: "PROCESSING" },
  });

  // Respond immediately — the whole point of the queue.
  return res.status(202).json({
    jobId: job.SCN_ID,
    batchId: batch.BAT_ID,
    totalUrls: job.SCN_TotalURLs,
    status: job.SCN_Status,
  });
});

// GET /api/jobs/:jobId
// Progress is computed by counting finished SCAN_RESULT rows, not a
// shared counter field — this is the pattern that avoids the write-
// contention issue we identified earlier for SCAN_JOB.
router.get("/jobs/:jobId", async (req, res) => {
  const jobId = Number(req.params.jobId);

  const job = await prisma.sCAN_JOB.findUnique({ where: { SCN_ID: jobId } });
  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const completedCount = await prisma.sCAN_RESULT.count({
    where: { SCAN_JOB_SCN_ID: jobId, RES_CheckedAt: { not: null } },
  });

  return res.json({
    jobId: job.SCN_ID,
    status: job.SCN_Status,
    totalUrls: job.SCN_TotalURLs,
    completedUrls: completedCount,
  });
});

// GET /api/jobs/:jobId/results
router.get("/jobs/:jobId/results", async (req, res) => {
    const jobId = Number(req.params.jobId);

    if (!Number.isInteger(jobId)) {
        return res.status(400).json({ error: "Invalid job ID" });
    }

    const job = await prisma.sCAN_JOB.findUnique({
        where: {
            SCN_ID: jobId,
        },
        include: {
            batch: true,
            results: {
                include: {
                    url: true,
                },
                orderBy: {
                    RES_ID: "asc",
                },
            },
        },
    });

    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }

    return res.json({
        jobId: job.SCN_ID,
        batchId: job.URL_BATCH_BAT_ID,
        fileName: job.batch.BAT_FileName,
        status: job.SCN_Status,
        totalUrls: job.SCN_TotalURLs,
        startedAt: job.SCN_StartedAt,
        completedAt: job.SCN_CompletedAt,

        results: job.results.map((result) => ({
            resultId: result.RES_ID,

            url: {
                id: result.url.URL_ID,
                original: result.url.URL_Original,
                normalized: result.url.URL_Normalized,
                isDuplicate: result.url.URL_IsDuplicate,
            },

            httpStatus: result.RES_HTTPStatus,
            statusLabel: result.RES_StatusLabel,
            finalUrl: result.RES_FinalURL,
            redirectCount: result.RES_RedirectCount,
            errorType: result.RES_ErrorType,
            checkedAt: result.RES_CheckedAt,
        })),
    });
});

module.exports = router;