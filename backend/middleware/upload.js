const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Resumes are private: this folder is never served statically
const RESUME_DIR = path.join(__dirname, "..", "uploads", "resumes");
fs.mkdirSync(RESUME_DIR, { recursive: true });

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: RESUME_DIR,
    filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}.pdf`)
});

const uploadResume = multer({
    storage,
    limits: { fileSize: MAX_RESUME_BYTES, files: 1 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            const error = new Error("Resume must be a PDF.");
            error.status = 400;
            return cb(error);
        }
        cb(null, true);
    }
}).single("resume");

const resumePath = (filename) => path.join(RESUME_DIR, path.basename(filename));

module.exports = { uploadResume, resumePath, MAX_RESUME_BYTES };
