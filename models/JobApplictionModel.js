const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  experience: { type: String, required: true },
  position: { type: String, required: true },
  city: { type: String, required: true },
  resume: { type: String, required: true }, // Path to the uploaded resume
  info: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
