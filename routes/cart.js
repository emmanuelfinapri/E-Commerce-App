const express = require("express");
const { addToCart, removeFromCart } = require("../controllers/cart");
const { loginVerify } = require("../middlewares/verify");
const routes = express.Router();

// Route to add an item to the cart, requires the user to be logged in
routes.post("/add-to-cart", loginVerify, addToCart);

// Route to remove an item from the cart, requires the user to be logged in
routes.delete("/remove-from-cart", loginVerify, removeFromCart);

module.exports = routes;
