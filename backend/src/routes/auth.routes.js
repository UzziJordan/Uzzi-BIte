/*auth.routes.js
Login
POST /login*/

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
// import controller
const { loginAdmin, loginTable, logout } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

// Rate limiting for login only
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased from 10 to 50 for restaurant environment
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// routes

//Admin login
router.post("/login", loginLimiter, loginAdmin);

//Table Login
router.post("/table-login", loginLimiter, loginTable);

// Logout (No rate limit for logout to ensure tables are released)
router.post("/logout", verifyToken, logout);

module.exports = router;


