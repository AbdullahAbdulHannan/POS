const express = require("express");
const router = express.Router();
const { superadminLogin, createAdmin,adminLogin, userLogin } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const { getNewRequests, getAllSubscriptions } = require("../controllers/superAdminController");

router.post("/superadmin/login", superadminLogin);
router.post("/superadmin/create-admin", verifyToken("superadmin"), createAdmin);
// routes/superAdminRoutes.js
router.get('/superadmin/requests', verifyToken("superadmin"), getNewRequests);
router.get('/superadmin/subscriptions', verifyToken("superadmin"), getAllSubscriptions);

router.post("/admin/login", adminLogin);
router.post("/user/login", userLogin);
module.exports = router;
