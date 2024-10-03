const jwt = require("jsonwebtoken");

const logoutVerify = async (req, res, next) => {
  // Check if the user is already logged in via the cookie
  const { user_token } = req.cookies;
  if (user_token) {
    jwt.verify(user_token, process.env.JWT_SECRET, (error, info) => {
      if (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(400).json({
        message: `You are still logged in as ${info.email}. Please log out first.`,
      });
    });
  } else {
    next();
  }
};

const loginVerify = (req, res, next) => {
  const { user_token } = req.cookies;

  if (!user_token) {
    return res.json({ message: "you are not logged in" });
  }
  jwt.verify(user_token, process.env.JWT_SECRET, (error, info) => {
    if (error) {
      return res.json({ message: "invalid token" });
    }
    req.user = info;

    next();
  });
};

module.exports = { logoutVerify, loginVerify };
