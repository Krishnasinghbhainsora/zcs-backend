const JobApplication = require("../models/JobApplictionModel");
const path = require("path");
const fs = require("fs");

// Submit a new job application
const submitJobApplication = async (req, res) => {
  try {
    const { name, mobile, email, experience, position, city, info } = req.body;
    const resume = req.file ? req.file.filename : null;

    if (!name || !mobile || !email || !experience || !position || !city || !resume) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for existing application
    const existingApplication = await JobApplication.findOne({ $or: [{ email }, { mobile }] });
    if (existingApplication) {
      return res.status(400).json({ message: "Email or mobile number already exists." });
    }

    // Save application
    const newApplication = new JobApplication({
      name,
      mobile,
      email,
      experience,
      position,
      city,
      resume,
      info,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Fetch all job applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find();
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Download resume
const downloadResume = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found." });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Error downloading file." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Delete job application
const deleteJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  submitJobApplication,
  getAllApplications,
  downloadResume,
  deleteJobApplication,
};
