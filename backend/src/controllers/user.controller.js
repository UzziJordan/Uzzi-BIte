/*(Admin creates table accounts)

What it contains:
Create users (tables)
Maybe delete users later

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
      username: `table${tableNumber}`,
      tableNumber,
      role: "table" 
      // NO PASSWORD FOR TABLES
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
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  } 
};

// 5. SEED CONSTANT ADMIN - RUN ONCE ON SERVER START
exports.createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" })
    if (adminExists) {
      console.log("Admin already exists")
      return
    }

    // 6. CREATE ADMIN WITH PLAIN TEXT PASSWORD
    await User.create({
      username: "admin",
      password: "admin123", // PLAIN TEXT - FIX THIS LATER
      role: "admin"
    })
    console.log("Default admin created: admin / admin123")
  } catch (error) {
    console.error("Error creating admin:", error)
  }
}

*/