const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");

const createUser = async ({ name, email, password, role = "user" }) => {
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: await hashPassword(password),
    role,
  });
  return user;
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user || !(await comparePassword(password, user.password))) return null;
  return user;
};

module.exports = { createUser, authenticateUser };
