const JobApplication = require("../models/JobApplictionModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const submitJobApplication = async (req, res) => {
  try {
    const { name, mobile, email, experience, position, city, info } = req.body;

    if (!name || !mobile || !email || !experience || !position || !city || !req.file) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Upload resume to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resumes",
      resource_type: "auto",
    });

    const resumeUrl = result.secure_url;

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

    // Remove file from local storage after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find();
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const resumeUrl = application.resume;
    return res.redirect(resumeUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

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
