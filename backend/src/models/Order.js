/*{
  table,
  items: [{ meal, quantity }],
  status: "pending" | "preparing" | "served"
}*/

const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items:{ 
      type: [
        {
          meal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meal",
            required: true
         },
          quantity: {
            type: Number,
            required: true,
            min: 1
          }
        }
      ],
      validate: [arr => arr.length > 0, "Order must have at least one item"]
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },


    status: {
      type: String,
      enum: ["pending", "accepted", "preparing", "ready", "served"],
      default: "pending",
      index: true
    },
    isCleared: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", OrderSchema);