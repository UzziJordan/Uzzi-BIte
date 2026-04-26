/*auth.routes.js
Login
POST /login*/

const express = require("express");
const router = express.Router();
// import controller
const { loginAdmin, loginTable } = require("../controllers/auth.controller");

// routes

//Admin login
router.post("/login", loginAdmin);

//Table Login
router.post("/table-login", loginTable);

module.exports = router;


