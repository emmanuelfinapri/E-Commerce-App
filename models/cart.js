const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    itemsInCart: {
      type: [String],
      default: [],
    },
    totalCost: {
      type: Number,
    },
    owner: {
      type: String,
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;
