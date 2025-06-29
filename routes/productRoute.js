const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  assignStockController,
  getUserStockController
} = require("../controllers/productController");
const { verifyToken } = require("../middleware/authMiddleware");
const checkSubscription = require('../middleware/checkSubscription')

router.post("/create-product", verifyToken("admin"), createProduct);
router.get("/", checkSubscription,verifyToken("admin"), getProducts);
router.get("/user-products",checkSubscription, verifyToken("user"), getProducts);
router.put("/:id", verifyToken("admin"), updateProduct);
router.delete("/:id", verifyToken("admin"), deleteProduct);
router.post("/assign-stock", verifyToken("admin"),assignStockController);
router.get("/user-stock/:userId",checkSubscription, verifyToken(["admin", "user"]), getUserStockController);


module.exports = router;
