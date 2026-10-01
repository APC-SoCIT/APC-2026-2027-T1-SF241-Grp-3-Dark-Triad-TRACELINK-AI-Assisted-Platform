const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const prisma = require("../lib/prisma");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Cleans up a raw URL string so duplicates can be detected reliably.
function normalizeUrl(raw) {
  try {
    const u = new URL(raw.trim());
    u.hash = "";
    let normalized = u.toString();
    if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
    return normalized.toLowerCase();
  } catch {
    return null; // not a valid URL at all
  }
}

// POST /api/batches
// Accepts a CSV upload, extracts URLs, normalizes them, flags duplicates,
// and stores everything as a new URL_BATCH. Does NOT start scanning yet.
router.post("/batches", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "A CSV file is required (field name: file)" });
  }

  let records;
  try {
    records = parse(req.file.buffer, { columns: false, skip_empty_lines: true });
  } catch (err) {
    return res.status(400).json({ error: "Could not parse the uploaded file as CSV" });
  }

  const rawUrls = records.map((row) => row[0]).filter(Boolean);

  if (rawUrls.length === 0) {
    return res.status(400).json({ error: "No URLs found in the uploaded file" });
  }

  const seen = new Set();
  const urlRows = [];
  for (const raw of rawUrls) {
    const normalized = normalizeUrl(raw);
    if (!normalized) continue; // skip anything that isn't a valid URL

    const isDuplicate = seen.has(normalized);
    if (!isDuplicate) seen.add(normalized);

    urlRows.push({ original: raw, normalized, isDuplicate });
  }

  const batch = await prisma.uRL_BATCH.create({
    data: {
      BAT_FileName: req.file.originalname,
      BAT_FileType: req.file.mimetype || "text/csv",
      BAT_TotalURLs: urlRows.length,
      urls: {
        create: urlRows.map((u) => ({
          URL_Original: u.original,
          URL_Normalized: u.normalized,
          URL_IsDuplicate: u.isDuplicate,
        })),
      },
    },
    include: { urls: true },
  });

  return res.status(201).json({
    batchId: batch.BAT_ID,
    fileName: batch.BAT_FileName,
    totalUrls: batch.BAT_TotalURLs,
    duplicateCount: urlRows.filter((u) => u.isDuplicate).length,
  });
});

module.exports = router;