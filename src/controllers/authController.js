// src/controllers/authController.js
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

const loginUser = (req, res) => {
  const user = req.body;
  const token = generateToken(user);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .send({ success: true });
};

const logoutUser = (req, res) => {
  res.clearCookie("token", { maxAge: 0 }).send({ success: true });
};

module.exports = {
  loginUser,
  logoutUser,
};
