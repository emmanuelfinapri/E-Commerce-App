const userModel = require("../models/user");

const deleteUser = async (req, res) => {
  try {
    const { id, email } = req.user;
    await userModel.findByIdAndDelete(id);
    res.clearCookie("user_token");
    res.status(200).json({
      message: `Your Account ${email} has successfully been deleted `,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { deleteUser };
