const express = require("express");
const { submitJobApplication, getAllApplications, deleteJobApplication } = require("../controllers/JobApplicationController");
const upload = require("../middleware/upload");

const router = express.Router();

// Job application routes
router.post("/submit", upload, submitJobApplication); // Submit an application
router.get("/", getAllApplications); // Get all applications
router.delete("/:id", deleteJobApplication); // Delete an application by ID

module.exports = router;
