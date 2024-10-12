const express = require("express");
const { register, login, logout } = require("../controllers/auth");
const { logoutVerify, loginVerify } = require("../middlewares/verify");
const routes = express.Router();

// Route to register a new user, ensures the user is not logged in
routes.post("/user", logoutVerify, register);

// Route for user login, ensures the user is not logged in
routes.post("/login", logoutVerify, login);

// Route for user logout, verifies the user is logged in
routes.post("/logout", loginVerify, logout);

module.exports = routes;
