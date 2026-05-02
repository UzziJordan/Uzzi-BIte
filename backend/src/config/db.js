//Connects to MongoDB using mongoose

const mongoose = require("mongoose");

const connectDB = async (retryCount = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    
    if (retryCount > 0) {
      console.log(`🔄 Retrying connection... (${retryCount} attempts left)`);
      setTimeout(() => connectDB(retryCount - 1), 5000);
    } else {
      console.error("💀 Could not connect to MongoDB after multiple attempts. Exiting...");
      process.exit(1);
    }
  }
};


module.exports = connectDB;
