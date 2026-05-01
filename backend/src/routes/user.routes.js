const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createUser, getUsers, deleteUser, getProfile, updateProfile, deleteProfile, resetTableStatus } = require("../controllers/user.controller");

router.post("/", verifyToken, isAdmin, createUser);
router.get("/", verifyToken, isAdmin, getUsers);
router.delete("/:id", verifyToken, isAdmin, deleteUser);
router.patch("/:id/reset", verifyToken, isAdmin, resetTableStatus);

// Profile routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, isAdmin, updateProfile);
router.delete("/profile/delete", verifyToken, isAdmin, deleteProfile);

// Upload profile picture
router.post("/upload-avatar", verifyToken, isAdmin, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ url });
});

module.exports = router;
