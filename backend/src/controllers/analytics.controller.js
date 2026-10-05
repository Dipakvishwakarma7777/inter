const Ticket = require("../models/Ticket");
const { success } = require("../utils/response");
const analytics = async (req, res, next) => {
  try {
    const base =
      req.user.role === "user"
        ? { createdBy: req.user.id }
        : req.user.role === "agent"
          ? { assignedTo: req.user.id }
          : {};
    const [byStatus, byPriority, byCategory, monthly, sla] = await Promise.all([
      Ticket.aggregate([
        { $match: base },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Ticket.aggregate([
        { $match: base },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
      Ticket.aggregate([
        { $match: base },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            category: { $ifNull: ["$category.name", "Uncategorized"] },
            count: 1,
          },
        },
      ]),
      Ticket.aggregate([
        { $match: base },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 24 },
      ]),
      Ticket.aggregate([
        { $match: base },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            breached: { $sum: { $cond: ["$slaBreached", 1, 0] } },
          },
        },
      ]),
    ]);
    return success(res, {
      byStatus,
      byPriority,
      byCategory,
      monthly,
      sla: sla[0] || { total: 0, breached: 0 },
    });
  } catch (e) {
    next(e);
  }
};
module.exports = { analytics };
