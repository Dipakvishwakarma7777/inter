const Notification = require("../models/Notification");
const { success, failure } = require("../utils/response");
const { getPagination, getMeta } = require("../utils/pagination");

const getNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = { user: req.user.id };
    if (req.query.unread === "true") filter.isRead = false;
    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
    ]);
    return res.json({
      success: true,
      data: items,
      meta: getMeta(page, limit, total),
    });
  } catch (e) {
    next(e);
  }
};

const markRead = async (req, res, next) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true },
    );
    if (!n) return failure(res, "Notification not found", 404);
    return success(res, n, "Notification marked as read");
  } catch (e) {
    next(e);
  }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true },
    );
    return success(res, null, "All notifications marked as read");
  } catch (e) {
    next(e);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const n = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!n) return failure(res, "Notification not found", 404);
    return success(res, null, "Notification deleted");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
};
