const User = require("../models/User");
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const findUsers = async ({ role, search } = {}) => {
  const filter = {};
  if (role && ["user", "agent", "admin"].includes(role)) filter.role = role;
  if (search) {
    const rx = new RegExp(escapeRegex(search).slice(0, 100), "i");
    filter.$or = [{ name: rx }, { email: rx }];
  }
  return User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(100);
};
module.exports = { findUsers };
