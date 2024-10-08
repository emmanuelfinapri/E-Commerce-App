const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { password, email, ...others } = req.body;

    const userInfo = await userModel.findOne({ email });
    if (userInfo) {
      return res
        .status(400)
        .json({ message: `Sorry ${email} is already taken, find a new one` });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user instance with hashed password
    const newUser = new userModel({
      email,
      password: hashedPassword,
      ...others,
    });

    // save the new user to the database
    const savedUser = await newUser.save();

    // Send a success response with the saved user data
    res.status(200).json({
      message: "Account created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    // Check if the user exists in the database
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      return res
        .status(400)
        .json({ message: "user not found, register your account" });
    }

    // Verify the provided password with the stored hashed password
    const verify = bcrypt.compareSync(password, userInfo.password);
    if (!verify) {
      return res.status(400).json({ message: "Password does not match" });
    }

    const aboutUser = {
      id: userInfo.id,
      email: userInfo.email,
      role: userInfo.role,
      password: userInfo.password,
    };

    const token = jwt.sign(aboutUser, process.env.JWT_SECRET);
    res.cookie("user_token", token);

    // Send a success response with the saved user data
    res.status(200).json({
      message: `Welcome ${userInfo.email} you are now logged in`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  const { email } = req.user;
  try {
    res
      .clearCookie("user_token")
      .status(201)
      .json({ message: `Logged out ${email} successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, logout };
