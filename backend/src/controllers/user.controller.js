const User = require("../models/User");

// 1. CREATE TABLE ACCOUNT - ADMIN ONLY
exports.createUser = async (req, res) => {
  try {
    const { tableNumber } = req.body
    
    // 2. VALIDATE INPUT
    if (!tableNumber) {
      return res.status(400).json({ message: "tableNumber is required" })
    }

    // 3. CREATE TABLE USER
    const user = await User.create({ 
      tableNumber,
      role: "table" 
      // NO PASSWORD FOR TABLES as per loginTable controller
    })
    
    res.status(201).json(user)
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Table number already exists" })
    }
    res.status(500).json({ message: error.message })
  }
};

// 4. GET ALL USERS - ADMIN ONLY
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
