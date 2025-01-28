const multer = require("multer");
const path = require("path");
const express = require("express");
const {
  submitJobApplication,
  getAllApplications,
  downloadResume,
  deleteJobApplication,
} = require("../controllers/JobApplicationController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb("Only .pdf, .doc, and .docx formats are allowed!");
    }
  },
});

router.post("/submit", upload.single("resume"), submitJobApplication);
router.get("/", getAllApplications);
router.get("/download/:id", downloadResume);
router.delete("/:id", deleteJobApplication);

module.exports = router;
