const Subscription = require('../models/subscriptionModel')
const Admin = require('../models/admin')
const User = require('../models/userModel')

const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user

    let adminId

    if (user.role === 'admin') {
      adminId = user._id
    } else if (user.role === 'user') {
      adminId = user.admin
    } else {
      return res.status(403).json({ message: 'Invalid role' })
    }

    const subscription = await Subscription.findOne({ adminId })

    if (!subscription || new Date(subscription.endDate) < new Date()) {
      return res.status(403).json({ hold: true, message: 'Subscription expired' })
    }

    next()
  } catch (error) {
    console.error('Subscription check failed:', error)
    res.status(500).json({ message: 'Internal error while checking subscription' })
  }
}

module.exports = checkSubscription
