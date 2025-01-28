const Admin = require('../models/AdminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists.' });

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
    console.log(email, password); // Debug input data
  
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
  
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
  
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated:', token);
  
    res.status(200).json({ token, message: 'Login successful.' });
  } catch (error) {
    console.error('Error during login:', error.message); // Log the error
    res.status(500).json({ message: 'Error logging in.', error: error.message });
  }
};

// Forgot Password




module.exports = { registerAdmin, loginAdmin };
