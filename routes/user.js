const express = require("express");
const { deleteUser } = require("../controllers/user");
const { logoutVerify, loginVerify } = require("../middlewares/verify");
const routes = express.Router();

routes.delete("/delete-user", loginVerify, deleteUser);

module.exports = routes;
