const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const deleteUser = async (req, res) => {
  try {
    const { id, email } = req.user;
    await userModel.findByIdAndDelete(id);
    res.clearCookie("user_token");
    res.status(200).json({
      message: `Your Account ${email} has successfully been deleted `,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    await userModel.deleteMany({});
    res.clearCookie("user_token");
    res.status(200).json({
      message: `You Have successfully Deleted every Account in this application`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { password, email } = req.user;

  try {
    const verify = bcrypt.compareSync(oldPassword, password);
    if (!verify) {
      return res.json({ error: "The old password is invalid" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    res
      .status(200)
      .json({ message: `Successfully Updated Your Password ${email}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { deleteUser, deleteAllUsers, updatePassword };
