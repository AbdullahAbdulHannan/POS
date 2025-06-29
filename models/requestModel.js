const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true,unique: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  packageName: String,
  amount: Number,
  paymentTime: Date,
  stripeSessionId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
