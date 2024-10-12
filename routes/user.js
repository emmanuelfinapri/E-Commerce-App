const express = require("express");
const {
  deleteUser,
  deleteAllUsers,
  updatePassword,
} = require("../controllers/user");
const { loginVerify, superAdminVerify } = require("../middlewares/verify");
const routes = express.Router();

// Route to delete a specific user, requires login verification
routes.delete("/delete-user", loginVerify, deleteUser);

// Route to delete all users, requires login and super admin verification
routes.delete(
  "/delete-all-users",
  loginVerify,
  superAdminVerify,
  deleteAllUsers
);

// Route to update a user's password, requires login verification
routes.put("/update-password", loginVerify, updatePassword);

module.exports = routes;
