const express = require("express");
const { upload } = require("../config/cloudinary"); // Ensure this is imported correctly
const {
  submitJobApplication,
  getAllApplications,
  downloadResume,
  deleteJobApplication,
} = require("../controllers/JobApplicationController");

const router = express.Router();

router.post("/submit", upload.single("resume"), submitJobApplication);
router.get("/", getAllApplications);
router.get("/download/:id", downloadResume);
router.delete("/:id", deleteJobApplication);

module.exports = router;