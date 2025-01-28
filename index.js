const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const jobApplicationRoutes = require("./routes/JobApplicationRoutes");
const adminRoutes = require("./routes/AdminRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Routes
app.use("/job-application", jobApplicationRoutes);
app.use("/admin", adminRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Successfully"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Start Server


app.get('/resume/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);  // Adjust this path based on where your files are stored

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving resume:', err);
      res.status(500).send("Error serving resume.");
    }
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
