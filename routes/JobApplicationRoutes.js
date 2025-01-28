const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  submitJobApplication,
  getAllApplications,
  downloadResume,
  deleteJobApplication,
} = require("../controllers/JobApplicationController");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Only .pdf, .doc, .docx formats are allowed!");
    }
  },
});

router.post("/submit", upload.single("resume"), submitJobApplication);
router.get("/", getAllApplications);
router.get("/download/:filename", downloadResume);
router.delete("/:id", deleteJobApplication);

module.exports = router;
