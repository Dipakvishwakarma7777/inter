const User = require("../models/User");
const { findUsers } = require("../services/user.service");
const { hashPassword } = require("../utils/password");
const { success, failure } = require("../utils/response");
const getUsers = async (req, res, next) => {
  try {
    return success(res, await findUsers(req.query));
  } catch (e) {
    next(e);
  }
};
const getUser = async (req, res, next) => {
  try {
    if (
      !["admin", "agent"].includes(req.user.role) &&
      String(req.params.id) !== String(req.user.id)
    )
      return failure(res, "Access denied", 403);
    const user = await User.findById(req.params.id);
    if (!user) return failure(res, "User not found", 404);
    return success(res, user);
  } catch (e) {
    next(e);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const id = ["admin", "agent"].includes(req.user.role)
      ? req.params.id
      : req.user.id;
    const allowed = ["name", "phone", "profileImage"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k)),
    );
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return failure(res, "User not found", 404);
    return success(res, user, "Profile updated");
  } catch (e) {
    next(e);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return failure(res, "User not found", 404);
    if (!req.body.password || req.body.password.length < 8)
      return failure(res, "Password must be at least 8 characters", 422);
    user.password = await hashPassword(req.body.password);
    await user.save();
    return success(res, null, "Password changed");
  } catch (e) {
    next(e);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user.id))
      return failure(res, "You cannot deactivate yourself", 400);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!user) return failure(res, "User not found", 404);
    return success(res, user, "User deactivated");
  } catch (e) {
    next(e);
  }
};
module.exports = { getUsers, getUser, updateUser, changePassword, deleteUser };
