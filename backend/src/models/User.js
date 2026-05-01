// 1. IMPORTS
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


// 2. CREATE SCHEMA
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function () {
      return this.role === "admin";
    },
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    // 3. REQUIRE PASSWORD ONLY FOR ADMIN
    required: function() { 
      return this.role === "admin" 
    },
    minlength: 6
  },

  role: {
    type: String,
    enum: ["admin", "table"],
    default: "table"
  },

  // 4. TABLE NUMBER FOR CUSTOMER LOGIN
  tableNumber: {
    type: Number,
    required: function() {
      return this.role === "table"
    },
    unique: true,
    sparse: true
  },
  profilePicture: {
    type: String,
    default: "https://i.pravatar.cc/150?u=admin"
  },
  isOccupied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model("User", userSchema)