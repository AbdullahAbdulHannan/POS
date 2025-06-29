const Superadmin = require("../models/superAdmin");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const User=require("../models/userModel")
const Subscription = require('../models/subscriptionModel');
const Request = require('../models/requestModel');
const Package = require('../models/packageModel');

const superadminLogin = async (req, res) => {
  const { email, password } = req.body;
  const superadmin = await Superadmin.findOne({ email, password });
  if (!superadmin) return res.status(401).json({ message: "Login failed" });

  const token = jwt.sign({ id: superadmin._id, role: "superadmin" }, process.env.JWT_SECRET);
  res.status(200).json({ token });
};

// const createAdmin = async (req, res) => {
//   try {
//     const admin = new Admin(req.body);
//     await admin.save();
//     res.status(201).json({ message: "Admin created" });
//   } catch (err) {
//     res.status(500).json({ message: "Admin creation failed", error: err.message });
//   }
// };


const createAdmin = async (req, res) => {
  try {
    const { adminId, name, email, number, password } = req.body;

    // 1. Validate required fields
    if (!adminId || !name || !email || !number || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check for existing Admin
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { adminId }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin ID or Email already exists' });
    }

    // 3. Fetch request
    const request = await Request.findOne({ email }).populate("packageId");
    if (!request) {
      return res.status(404).json({ message: "Request not found for this email" });
    }

    // 4. Ensure request.packageId contains durationInDays
    if (!request.packageId || !request.packageId.durationInDays) {
      return res.status(400).json({ message: "Invalid package information in request" });
    }

    // 6. Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + request.packageId.durationInDays);
    // 5. Create Admin
    const newAdmin = new Admin({ adminId, name, email, number, password,expiresAt:endDate });
    await newAdmin.save();


    // 7. Create Subscription
    const subscription = new Subscription({
      adminId: newAdmin._id,
      email: newAdmin.email,
      packageId: request.packageId._id,
      packageName: request.packageName,
      amount: request.amount,
      startDate,
      endDate,
      stripeSessionId: request.stripeSessionId,
    });
    await subscription.save();

    // 8. Delete request after success
    await Request.findByIdAndDelete(request._id);

    res.status(201).json({ message: "Admin created and subscription added!" });
  } catch (err) {
    console.error("Error in createAdmin:", err);
    res.status(500).json({ message: "Failed to create admin", error: err.message });
  }
};



const adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    const admin = await Admin.findOne({ adminId, password });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, admin });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
const userLogin = async (req, res) => {
  try {
    console.log("Login body:", req.body);

    const { userId, password } = req.body;

    const user = await User.findOne({ userId, password });
    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("User Login Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


module.exports = { superadminLogin, createAdmin, adminLogin ,userLogin};
