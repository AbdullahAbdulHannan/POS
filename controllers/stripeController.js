const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Package = require("../models/packageModel");
const Request = require("../models/requestModel");

exports.createCheckoutSession = async (req, res) => {
  const { userId, packageId } = req.body;

  try {
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: pkg.name,
              description: `Duration: ${pkg.duration} days`,
            },
            unit_amount: pkg.amount * 100, // in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        packageId,
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stripe checkout session failed" });
  }
};
