const JobApplication = require("../models/JobApplictionModel");

// Create a new job application
const submitJobApplication = async (req, res) => {
  try {
    const { name, mobile, email, experience, position, city, info } = req.body;
    const resume = req.file ? req.file.path : null;

    if (!name || !mobile || !email || !experience || !position || !city || !resume) {
      return res.status(400).json({ message: "All fields are required, including the resume." });
    }

    // Check if email or mobile already exists
    const existingApplication = await JobApplication.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "This email or mobile number is already associated with an application.",
      });
    }

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
    console.error("Submit Application Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Fetch all job applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find();
    res.status(200).json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Delete a job application by ID
const deleteJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete Application Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { submitJobApplication, getAllApplications, deleteJobApplication };
