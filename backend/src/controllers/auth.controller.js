/*What it contains:
Find user
Check password
Generate JWT token
Example:*/

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// ADMIN LOGIN
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, role: "admin" });

    // ✅ FIRST check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ THEN compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// TABLE LOGIN
exports.loginTable = async (req, res) => {
  try {
    const { tableNumber } = req.body;

    const user = await User.findOne({ tableNumber, role: "table" });

    if (!user) {
      return res.status(401).json({ message: "Invalid table" });
    }

    if (user.isOccupied) {
      return res.status(403).json({ message: "Table occupied" });
    }

    // Mark table as occupied
    user.isOccupied = true;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT (Release Table)
exports.logout = async (req, res) => {
  try {
    if (req.user && req.user.role === "table") {
      await User.findByIdAndUpdate(req.user.id, { isOccupied: false });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};