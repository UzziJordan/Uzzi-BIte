/*Handles orders (MOST IMPORTANT part)

What it contains:
Create order
Get orders
Update order status*/

const mongoose = require("mongoose");
const Order = require("../models/Order");
const Meal = require("../models/Meal");

// CREATE ORDER 

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const tableId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const mealIds = items.map(item => item.meal);
    const meals = await Meal.find({ _id: { $in: mealIds } });

    let totalPrice = 0;

    for (const item of items) {
      if (!item.meal || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: "Invalid item data" });
      }

      const meal = meals.find(m => m._id.toString() === item.meal);

      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }

      totalPrice += meal.price * item.quantity;
    }

    const order = await Order.create({
      table: tableId,
      items,
      totalPrice
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("table", "tableNumber")
      .populate("items.meal", "name price");

    const io = req.app.get("io");
    io.emit("newOrder", populatedOrder);

    res.status(201).json(populatedOrder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "preparing", "ready", "served"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = order.status;

    // Transition Logic:
    // pending -> accepted
    // accepted -> preparing
    // preparing -> ready
    // ready -> served

    const transitions = {
      "pending": "accepted",
      "accepted": "preparing",
      "preparing": "ready",
      "ready": "served"
    };

    if (transitions[currentStatus] !== status) {
      return res.status(400).json({ 
        message: `Invalid status transition from ${currentStatus} to ${status}. Expected ${transitions[currentStatus]}.` 
      });
    }

    order.status = status;
    await order.save();

    const io = req.app.get("io");
    io.emit("orderUpdated", order);

    res.status(200).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getOrders = async (req, res) => {
  try {
    const { includeCleared } = req.query;
    
    // Default to only showing non-cleared orders
    const query = includeCleared === "true" ? {} : { isCleared: false };

    const orders = await Order.find(query)
      .populate("table", "tableNumber")
      .populate("items.meal", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET MY ORDERS (TABLE)
exports.getMyOrders = async (req, res) => {
  try {
    const tableId = req.user.id;

    const orders = await Order.find({ table: tableId })
      .populate("items.meal", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ORDER
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("items.meal", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE ORDER (ADMIN)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const io = req.app.get("io");
    io.emit("orderDeleted", id);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE ALL SERVED ORDERS (ADMIN) - Soft delete to keep stats
exports.clearServedOrders = async (req, res) => {
  try {
    const result = await Order.updateMany(
      { status: "served", isCleared: false },
      { isCleared: true }
    );
    
    const io = req.app.get("io");
    io.emit("servedOrdersCleared");

    res.status(200).json({ 
      message: `${result.modifiedCount} served orders cleared from view`,
      count: result.modifiedCount 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};