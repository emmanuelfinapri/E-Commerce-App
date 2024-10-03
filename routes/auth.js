const express = require("express");
const { register, login, logout } = require("../controllers/auth");
const { logoutVerify, loginVerify } = require("../middlewares/verify");
const routes = express.Router();

routes.post("/user", logoutVerify, register);
routes.post("/login", logoutVerify, login);
routes.post("/logout", loginVerify, logout);

module.exports = routes;
