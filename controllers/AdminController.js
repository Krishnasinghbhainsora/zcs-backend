const Admin = require('../models/AdminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }

    // Create and save a new admin
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin.', error: error.message });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", admin.password);

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in.', error: error.message });
  }
};

// Change Admin Password
const changeAdminPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Old password is incorrect." });
    }

    // **Set new password and let Mongoose hash it**
    admin.password = newPassword;
    await admin.save(); // This will trigger `pre('save')` and hash the password

    // **Generate a new JWT token**
    const newToken = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Password updated successfully.", token: newToken });
  } catch (error) {
    res.status(500).json({ message: "Error updating password.", error: error.message });
  }
};




module.exports = { registerAdmin, loginAdmin, changeAdminPassword };
