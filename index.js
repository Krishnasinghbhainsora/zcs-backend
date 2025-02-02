const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const jobApplicationRoutes = require("./routes/JobApplicationRoutes");
const adminRoutes = require("./routes/AdminRoutes");

dotenv.config();

const app = express();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.get("/", (req, res) => {
  res.send("Welcome to the Job Application API!");
});

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Routes
app.use("/job-application", jobApplicationRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB Successfully"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
