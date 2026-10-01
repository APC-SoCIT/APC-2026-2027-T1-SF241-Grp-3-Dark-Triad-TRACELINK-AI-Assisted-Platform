const { Queue } = require("bullmq");
const IORedis = require("ioredis");

// BullMQ requires this exact option when connecting to Redis.
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const scanQueue = new Queue("url-scan", { connection });

module.exports = { scanQueue, connection };