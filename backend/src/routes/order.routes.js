/*Customers create orders
Admin updates status*/

const express = require("express");
const router = express.Router();

// import controller
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  clearServedOrders
} = require("../controllers/order.controller");

// import middleware
const { verifyToken, isAdmin, isTable } = require("../middleware/auth");

// table creates order
router.post("/", verifyToken, isTable, createOrder);

// admin gets all orders
router.get("/", verifyToken, isAdmin, getOrders);


// table gets their orders
router.get("/my-orders", verifyToken, isTable, getMyOrders);

// admin clears served orders
router.delete("/clear-served", verifyToken, isAdmin, clearServedOrders);

// get single order
router.get("/:id", verifyToken, getOrderById);

// admin updates order
router.put("/:id", verifyToken, isAdmin, updateOrderStatus);

// admin deletes order
router.delete("/:id", verifyToken, isAdmin, deleteOrder);

module.exports = router;