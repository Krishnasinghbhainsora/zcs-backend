const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes", // Cloudinary folder for resumes
    resource_type: "raw", 
    allowed_formats: ["pdf", "doc", "docx"], // Allowed formats
  },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
