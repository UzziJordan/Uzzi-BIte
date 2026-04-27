const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getMyOrders,
  getOrderById
} = require("../controllers/order.controller");

const { verifyToken, isAdmin, isTable } = require("../middleware/auth");

// CREATE
router.post("/", verifyToken, isTable, createOrder);

// ADMIN GET ALL
router.get("/", verifyToken, isAdmin, getOrders);

// TABLE GET OWN
router.get("/my-orders", verifyToken, isTable, getMyOrders);

// ✅ SINGLE ORDER (VERY IMPORTANT)
router.get("/:id", getOrderById);

// UPDATE
router.put("/:id", verifyToken, isAdmin, updateOrderStatus);

module.exports = router;