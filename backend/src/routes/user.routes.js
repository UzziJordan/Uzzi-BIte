const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const { createUser, getUsers, deleteUser } = require("../controllers/user.controller");

router.post("/", verifyToken, isAdmin, createUser);
router.get("/", verifyToken, isAdmin, getUsers);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;
