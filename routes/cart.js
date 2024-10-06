const express = require("express");
const { addToCart, removeFromCart } = require("../controllers/cart");
const { loginVerify } = require("../middlewares/verify");
const routes = express.Router();

routes.post("/add-to-cart", loginVerify, addToCart);
routes.delete("/remove-from-cart", loginVerify, removeFromCart);

module.exports = routes;
