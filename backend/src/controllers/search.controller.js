const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Category = require("../models/Category");
const { success } = require("../utils/response");

const search = async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return success(res, { tickets: [], users: [], categories: [] });

    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const ticketOwnerFilter =
      req.user.role === "admin"
        ? {}
        : req.user.role === "agent"
          ? { assignedTo: req.user.id }
          : { createdBy: req.user.id };
    const ticketFilter = {
      ...ticketOwnerFilter,
      $or: [{ title: rx }, { description: rx }],
    };

    const [tickets, users, categories] = await Promise.all([
      Ticket.find(ticketFilter).populate("category", "name").limit(20),
      ["admin", "agent"].includes(req.user.role)
        ? User.find({ $or: [{ name: rx }, { email: rx }] })
            .select("-password")
            .limit(20)
        : [],
      Category.find({ name: rx, isActive: true }).limit(20),
    ]);

    return success(res, { tickets, users, categories });
  } catch (e) {
    next(e);
  }
};

module.exports = { search };
