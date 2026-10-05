const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

module.exports = generateToken;
