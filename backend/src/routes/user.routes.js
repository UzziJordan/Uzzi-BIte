const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createUser, getUsers, deleteUser, getProfile, updateProfile, deleteProfile, resetTableStatus } = require("../controllers/user.controller");

router.post("/", verifyToken, isAdmin, createUser);
router.get("/", verifyToken, isAdmin, getUsers);
router.get("/tables", getUsers); // Public route for login page
router.delete("/:id", verifyToken, isAdmin, deleteUser);
router.patch("/:id/reset", verifyToken, isAdmin, resetTableStatus);

// Profile routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, isAdmin, updateProfile);
router.delete("/profile/delete", verifyToken, isAdmin, deleteProfile);

// Upload profile picture
router.post("/upload-avatar", verifyToken, isAdmin, upload.single("avatar"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }
    
    // Detect protocol correctly behind proxies like Render
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const url = `${protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    res.status(200).json({ url });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Internal server error during upload" });
  }
});

module.exports = router;
