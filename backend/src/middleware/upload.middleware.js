const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const env = require("../config/env");
const base = path.join(__dirname, "..", "uploads", "tickets");
fs.mkdirSync(base, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, base),
  filename: (_, file, cb) =>
    cb(
      null,
      `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`,
    ),
});
const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const fileFilter = (_, file, cb) =>
  allowed.has(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Unsupported file type"));
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.UPLOAD_MAX_MB * 1024 * 1024, files: 1 },
});
