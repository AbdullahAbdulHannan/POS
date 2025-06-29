// controllers/superAdminController.js
const Subscription = require('../models/subscriptionModel')
const Admin = require('../models/admin')
const Request = require('../models/requestModel');

const getNewRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 }); // newest first
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests", error: err.message });
  }
}

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('adminId', 'adminId name email number')
    res.status(200).json(subscriptions)
  } catch (err) {
    console.error("Error in getAllSubscriptions:", err)
    res.status(500).json({ message: "Failed to fetch subscriptions", error: err.message })
  }
}


module.exports = {
  getNewRequests,getAllSubscriptions            
};