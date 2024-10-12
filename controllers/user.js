const userModel = require("../models/user");
const bcrypt = require("bcryptjs"); // For password hashing and comparison
const jwt = require("jsonwebtoken"); // For handling authentication tokens

// Delete a single user
const deleteUser = async (req, res) => {
  try {
    const { id, email } = req.user; // Extract user id and email from the authenticated user
    await userModel.findByIdAndDelete(id); // Delete the user by their ID
    res.clearCookie("user_token"); // Clear the authentication token (cookie)
    res.status(200).json({
      message: `Your Account ${email} has successfully been deleted `,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Handle server error
  }
};

// Delete all users from the database
const deleteAllUsers = async (req, res) => {
  try {
    await userModel.deleteMany({}); // Delete all users
    res.clearCookie("user_token"); // Clear the authentication token (cookie)
    res.status(200).json({
      message: `You have successfully deleted every account in this application`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Handle server error
  }
};

// Update user password
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body; // Get old and new passwords from request body
  const { password, email } = req.user; // Get the current user's password and email

  try {
    const verify = bcrypt.compareSync(oldPassword, password); // Verify if the old password matches the stored password
    if (!verify) {
      return res.json({ error: "The old password is invalid" }); // Return an error if the passwords don't match
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password
    await userModel.findOneAndUpdate(
      { email }, // Find user by email
      { password: hashedPassword }, // Update their password with the hashed one
      { new: true }
    );

    res.status(200).json({
      message: `Successfully updated your password, ${email}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // Handle server error
  }
};

module.exports = { deleteUser, deleteAllUsers, updatePassword };
