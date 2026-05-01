const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const { createUser, getUsers, deleteUser, getProfile, updateProfile, deleteProfile } = require("../controllers/user.controller");

router.post("/", verifyToken, isAdmin, createUser);
router.get("/", verifyToken, isAdmin, getUsers);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

// Profile routes
router.get("/profile", verifyToken, isAdmin, getProfile);
router.put("/profile", verifyToken, isAdmin, updateProfile);
router.delete("/profile/delete", verifyToken, isAdmin, deleteProfile);

module.exports = router;
