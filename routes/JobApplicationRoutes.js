const express = require("express");
const { submitJobApplication, getAllApplications, deleteJobApplication } = require("../controllers/JobApplicationController");
const upload = require("../middlewares/Upload");

const router = express.Router();

router.post("/submit", upload, submitJobApplication);
router.get("/", getAllApplications);
router.delete("/:id", deleteJobApplication);

module.exports = router;