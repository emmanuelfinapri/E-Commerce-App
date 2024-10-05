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

const adminAndSuperAdminVerify = (req, res, next) => {
  const { role } = req.user;

  if (role !== "Admin" && role !== "SuperAdmin") {
    return res.json({
      message:
        "you are not an Admin or Super Admin so you can't make changes to the products",
    });
  }

  next();
};

const superAdminVerify = (req, res, next) => {
  const { role } = req.user;

  if (role !== "SuperAdmin") {
    return res.json({
      message:
        "you are not a Super Admin so you don't have Super Admin Previleges",
    });
  }

  next();
};

module.exports = {
  logoutVerify,
  loginVerify,
  adminAndSuperAdminVerify,
  superAdminVerify,
};
