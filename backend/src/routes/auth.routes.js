/*auth.routes.js
Login
POST /login*/

const express = require("express");
const router = express.Router();
// import controller
const { loginAdmin, loginTable, logout } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

// routes

//Admin login
router.post("/login", loginAdmin);

//Table Login
router.post("/table-login", loginTable);

// Logout
router.post("/logout", verifyToken, logout);

module.exports = router;


