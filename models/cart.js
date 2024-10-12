const mongoose = require("mongoose");

// Define the schema for the cart
const cartSchema = new mongoose.Schema(
  {
    // Array of items in the cart
    itemsInCart: {
      type: [String],
      default: [],
    },
    // Total cost of items in the cart
    totalCost: {
      type: Number,
    },
    // Owner of the cart, stored as a string (email or ID)
    owner: {
      type: String,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create a Mongoose model based on the schema
const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
