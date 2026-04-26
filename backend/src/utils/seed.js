/*Creates:
Admin account
Table users

👉 So you don’t manually create users every time*/

const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing users (optional but useful)
    await User.deleteMany();
    
    // Sync indexes to ensure sparse and unique constraints are correctly applied
    await User.syncIndexes();

    // Create users
    await User.create([
      {
        username: "admin",
        password: "123456",
        role: "admin"
      },
      {
        tableNumber: 1,
        role: "table"
      },
      {
        tableNumber: 2,
        role: "table"
      }
    ]);

    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();