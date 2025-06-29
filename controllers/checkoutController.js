const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Request = require("../models/requestModel");
const Package = require("../models/packageModel");
const Admin = require("../models/admin");
// @desc Create Stripe checkout session and save request
// @route POST /api/checkout/create-session
// exports.createCheckoutSession = async (req, res) => {
//   try {
//     const { name, email, packageId } = req.body;

//     if (!name || !email || !packageId) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if email already has a pending request
//     const existingRequest = await Request.findOne({ email });
//     if (existingRequest) {
//       return res.status(400).json({ message: "A request already exists with this email" });
//     }

//     // Get package details
//     const selectedPackage = await Package.findById(packageId);
//     if (!selectedPackage) {
//       return res.status(404).json({ message: "Package not found" });
//     }

//     // Create Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: selectedPackage.title,
//             },
//             unit_amount: selectedPackage.amount * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       customer_email: email,
//       success_url: `http://localhost:3000/superadmin`,
//       cancel_url: `http://localhost:3000/speradmin`,
//       metadata: {
//         name,
//         email,
//         packageId: selectedPackage._id.toString(),
//       },
//     });

//     // Save the request in DB
//     const newRequest = new Request({
//       name,
//       email,
//       package: {
//         title: selectedPackage.title,
//         amount: selectedPackage.amount,
//         durationInDays: selectedPackage.durationInDays,
//         packageId: selectedPackage._id,
//       },
//       stripeSessionId: session.id,
//     });

//     await newRequest.save();

//     res.status(200).json({ sessionId: session.id });
//   } catch (error) {
//     console.error("Stripe session error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

const createCheckoutSession=async (req, res) => {
  try {
    const { packageId, name, email } = req.body;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: pkg.title,
          },
          unit_amount: pkg.amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&packageId=${pkg._id}`,
      cancel_url: "http://localhost:3000",
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ message: "Failed to create Stripe session" });
  }
}
const verifyCheckoutSession= async (req, res) => {
  const { sessionId } = req.params;
  const { name, email, packageId } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const alreadyExists = await Request.findOne({ stripeSessionId: sessionId });
    if (alreadyExists) return res.status(200).json({ message: "Already saved" });

    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) return res.status(404).json({ message: "Package not found." });

    await Request.create({
      name,
      email,
      packageId,
      packageName: selectedPackage.title,
      amount: selectedPackage.amount,
      paymentTime: new Date(session.created * 1000),
      stripeSessionId: sessionId
    });

    return res.status(200).json({ message: "Payment verified & request saved" });
  } catch (err) {
    console.error("Session verify error:", err.message);
    return res.status(500).json({ message: "Error verifying session" });
  }
}
const checkEmailController=async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const existingRequest = await Request.findOne({ email });
  const existingAdmin = await Admin.findOne({ email });

  if (existingRequest || existingAdmin) {
    return res.status(409).json({ message: "Email already exists" });
  }

  return res.status(200).json({ message: "Email is available" });
}
module.exports = {
  createCheckoutSession, verifyCheckoutSession,checkEmailController 
}