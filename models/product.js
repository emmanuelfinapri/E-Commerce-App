const mongoose = require("mongoose");

// Define the schema for products
const productSchema = new mongoose.Schema(
  {
    // Product name must be unique and is required
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    // Product description with a default value if not provided
    productDesc: {
      type: String,
      default: "Description Not Available",
    },
    // Product price is required
    productPrice: {
      type: Number,
      required: true,
    },
    // Product status, with predefined options and defaulting to "Available"
    productStatus: {
      type: String,
      enum: ["Available", "Out of stock", "Discontinued"],
      default: "Available",
    },
  },
  { timestamps: true }
);

// Create a Mongoose model based on the schema
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
