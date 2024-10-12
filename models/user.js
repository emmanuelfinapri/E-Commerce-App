const mongoose = require("mongoose");

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    // User's email, must be unique and is required
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // User's password, required for authentication
    password: {
      type: String,
      required: true,
    },
    // Gender of the user, must be either Male or Female
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    // Role of the user, with default set to Basic
    role: {
      type: String,
      enum: ["Basic", "Admin", "SuperAdmin"],
      default: "Basic",
    },
    // Array of products available to the user
    productsAvailable: {
      type: [String],
      default: [],
    },
    // User's cart, storing item IDs or names
    cart: {
      type: [String],
      default: [],
    },
    // Total cost of items in the user's cart
    totalCostInCart: {
      type: Number,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create a Mongoose model based on the schema
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
