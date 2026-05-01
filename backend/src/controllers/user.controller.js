const User = require("../models/User");

// 1. CREATE TABLE OR ADMIN ACCOUNT - ADMIN ONLY
exports.createUser = async (req, res) => {
  try {
    const { tableNumber, username, password, role } = req.body
    
    // Create Admin
    if (role === "admin") {
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required for admin" })
      }
      const admin = await User.create({ username, password, role: "admin" });
      return res.status(201).json(admin);
    }

    // Create Table
    if (!tableNumber) {
      return res.status(400).json({ message: "tableNumber is required" })
    }

    const user = await User.create({ 
      tableNumber,
      role: "table" 
    })
    
    res.status(201).json(user)
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username or Table number already exists" })
    }
    res.status(500).json({ message: error.message })
  }
};

// GET ADMIN PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ADMIN PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { username, password, profilePicture } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (username) user.username = username;
    if (password) user.password = password;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE OWN PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 4. GET ALL TABLES - ADMIN ONLY
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "table" })
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  } 
};

// DELETE USER - ADMIN ONLY
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Table deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
};
