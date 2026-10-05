const bcrypt = require("bcryptjs");

const hashPassword = (password) => bcrypt.hash(password, 12);
const comparePassword = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

module.exports = { hashPassword, comparePassword };
