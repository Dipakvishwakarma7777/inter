const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Category = require("../models/Category");

const getDashboard = async (user) => {
  const base =
    user.role === "user"
      ? { createdBy: user.id }
      : user.role === "agent"
        ? { assignedTo: user.id }
        : {};
  const [total, open, progress, resolved, closed, urgent, users, categories] =
    await Promise.all([
      Ticket.countDocuments(base),
      Ticket.countDocuments({ ...base, status: "open" }),
      Ticket.countDocuments({ ...base, status: "in-progress" }),
      Ticket.countDocuments({ ...base, status: "resolved" }),
      Ticket.countDocuments({ ...base, status: "closed" }),
      Ticket.countDocuments({ ...base, priority: "urgent" }),
      ["admin", "agent"].includes(user.role)
        ? User.countDocuments({ isActive: true })
        : Promise.resolve(undefined),
      ["admin", "agent"].includes(user.role)
        ? Category.countDocuments({ isActive: true })
        : Promise.resolve(undefined),
    ]);

  return {
    tickets: { total, open, inProgress: progress, resolved, closed, urgent },
    ...(users !== undefined ? { users, categories } : {}),
  };
};

module.exports = { getDashboard };
