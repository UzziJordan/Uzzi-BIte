/*{
  name,
  price,
  image,
  available
}*/

//Import mongoose
const mongoose = require("mongoose");

//Create schema
const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: ["Rice", "Burgers", "Pizza", "Swallow", "Drinks"]
    },

    image: {
      type: String
    },

    available: {
      type: Boolean,
      default: true
    }
  },
  
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meal", mealSchema);