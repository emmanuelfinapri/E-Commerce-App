const express = require("express");
const {
  deleteUser,
  deleteAllUsers,
  updatePassword,
} = require("../controllers/user");
const { loginVerify, superAdminVerify } = require("../middlewares/verify");
const routes = express.Router();

routes.delete("/delete-user", loginVerify, deleteUser);
routes.delete(
  "/delete-all-users",
  loginVerify,
  superAdminVerify,
  deleteAllUsers
);
routes.put("/update-password", loginVerify, updatePassword);

module.exports = routes;
