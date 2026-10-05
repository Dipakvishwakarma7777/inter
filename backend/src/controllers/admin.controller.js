const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { success, failure } = require("../utils/response");
const { hashPassword } = require("../utils/password");
const { getPagination, getMeta } = require("../utils/pagination");
const Ticket = require("../models/Ticket");
const Category = require("../models/Category");
const updateUserRole = async (req, res, next) => {
  try {
    if (!["user", "agent", "admin"].includes(req.body.role))
      return failure(res, "Invalid role", 422);
    if (
      String(req.params.id) === String(req.user.id) &&
      req.body.role !== "admin"
    )
      return failure(res, "You cannot remove your own admin role", 400);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true },
    );
    if (!user) return failure(res, "User not found", 404);
    return success(res, user, "Role updated");
  } catch (e) {
    next(e);
  }
};
const setUserStatus = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user.id))
      return failure(res, "You cannot deactivate yourself", 400);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive === true },
      { new: true },
    );
    if (!user) return failure(res, "User not found", 404);
    return success(res, user, "User status updated");
  } catch (e) {
    next(e);
  }
};
const getActivityLogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [logs, total] = await Promise.all([
      ActivityLog.find()
        .populate("user", "name email role")
        .populate("ticket", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(),
    ]);
    return res.json({
      success: true,
      data: logs,
      meta: getMeta(page, limit, total),
    });
  } catch (e) {
    next(e);
  }
};
const getDashboard = async (req, res, next) => {
  try {
    const [users, agents, tickets, categories, open, breached] =
      await Promise.all([
        User.countDocuments({ role: "user", isActive: true }),
        User.countDocuments({ role: "agent", isActive: true }),
        Ticket.countDocuments(),
        Category.countDocuments({ isActive: true }),
        Ticket.countDocuments({ status: { $nin: ["resolved", "closed"] } }),
        Ticket.countDocuments({
          slaBreached: true,
          status: { $nin: ["resolved", "closed"] },
        }),
      ]);
    return success(res, { users, agents, tickets, categories, open, breached });
  } catch (e) {
    next(e);
  }
};
const getAgents = async (req, res, next) => {
  try {
    return success(
      res,
      await User.find({ role: "agent" })
        .select("-password")
        .sort({ createdAt: -1 }),
    );
  } catch (e) {
    next(e);
  }
};
const createAgent = async (req, res, next) => {
  try {
    const user = await require("../services/auth.service").createUser({
      ...req.body,
      role: "agent",
    });
    return success(res, user, "Agent created", 201);
  } catch (e) {
    next(e);
  }
};
const updateAgent = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "agent" },
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          isActive: req.body.isActive,
        },
      },
      { new: true, runValidators: true },
    );
    if (!user) return failure(res, "Agent not found", 404);
    return success(res, user, "Agent updated");
  } catch (e) {
    next(e);
  }
};
const getCategories = async (req, res, next) => {
  try {
    return success(res, await Category.find().sort({ name: 1 }));
  } catch (e) {
    next(e);
  }
};
const createCategory = async (req, res, next) => {
  try {
    return success(
      res,
      await Category.create(req.body),
      "Category created",
      201,
    );
  } catch (e) {
    next(e);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const c = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!c) return failure(res, "Category not found", 404);
    return success(res, c, "Category deactivated");
  } catch (e) {
    next(e);
  }
};
module.exports = {
  updateUserRole,
  setUserStatus,
  getActivityLogs,
  getDashboard,
  getAgents,
  createAgent,
  updateAgent,
  getCategories,
  createCategory,
  deleteCategory,
};
