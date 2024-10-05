const express = require("express");
const { deleteUser, deleteAllUsers } = require("../controllers/user");
const { loginVerify, superAdminVerify } = require("../middlewares/verify");
const routes = express.Router();

routes.delete("/delete-user", loginVerify, deleteUser);
routes.delete(
  "/delete-all-users",
  loginVerify,
  superAdminVerify,
  deleteAllUsers
);

module.exports = routes;
