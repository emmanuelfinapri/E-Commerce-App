const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    role: {
      type: String,
      enum: ["Basic", "Admin", "SuperAdmin"],
      default: "Basic",
    },
    productsAvailable: {
      type: [String],
      default: [],
    },
    cart: {
      type: [String],
      default: [],
    },
    totalCostInCart: {
      type: Number,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
