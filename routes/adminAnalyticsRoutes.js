const express = require("express");
const checkSubscription = require('../middleware/checkSubscription')

const router = express.Router();
const {
  getTotalSales,
  getTotalOrders,
  getMonthlySales,
  getTopCategories
} = require("../controllers/statsController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/total-sales",checkSubscription, verifyToken("admin"), getTotalSales);
router.get("/total-orders",checkSubscription, verifyToken("admin"), getTotalOrders);
router.get("/monthly-sales",checkSubscription, verifyToken("admin"), getMonthlySales);
router.get("/top-categories",checkSubscription, verifyToken("admin"), getTopCategories);

module.exports = router;
