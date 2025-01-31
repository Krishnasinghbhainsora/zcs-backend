const JobApplication = require("../models/JobApplictionModel");
const { cloudinary } = require("../config/cloudinary");
const fs = require("fs/promises"); // Use promises version for better async handling
const { default: axios } = require('axios');

// Submit Job Application
const submitJobApplication = async (req, res) => {
  try {
    const { name, mobile, email, experience, position, city, info } = req.body;

    // Check if the file is uploaded
    if (!name || !mobile || !email || !experience || !position || !city || !req.file) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // The file is automatically uploaded to Cloudinary by multer-storage-cloudinary
    const resumeUrl = req.file.path; // Get the URL from the uploaded file

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
      resume: resumeUrl,
      info,
    });

    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get All Applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 }); // Sort by newest
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};



// Download Resume (providing a secure URL)
const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const resumeUrl = application.resume;

    if (!resumeUrl) {
      return res.status(404).json({ message: "Resume not available." });
    }

    // Return the URL so the frontend can download it
    res.status(200).json({ resumeUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};





// Delete Job Application
const deleteJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    // Delete resume from Cloudinary
    const publicId = application.resume.split("/").pop().split(".")[0]; // Extract public ID from URL
    await cloudinary.uploader.destroy(`resumes/${publicId}`);

    await JobApplication.findByIdAndDelete(id);
    res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  submitJobApplication,
  getAllApplications,
  downloadResume,
  deleteJobApplication,
};



