const Ticket = require("../models/Ticket");
const ActivityLog = require("../models/ActivityLog");
const log = (user, action, description, ticket = null) =>
  ActivityLog.create({ user, action, description, ticket });
const canAccessTicket = (ticket, user) => {
  if (user.role === "admin") return true;
  const userId = String(user.id);
  if (user.role === "agent")
    return String(ticket.assignedTo?._id || ticket.assignedTo || "") === userId;
  return String(ticket.createdBy?._id || ticket.createdBy) === userId;
};
const populateTicket = (query) =>
  query
    .populate("createdBy", "name email role")
    .populate("assignedTo", "name email role")
    .populate("category", "name description");
const getTicketOrThrow = async (id) => {
  const t = await populateTicket(Ticket.findById(id));
  if (!t) {
    const e = new Error("Ticket not found");
    e.statusCode = 404;
    throw e;
  }
  return t;
};
module.exports = { log, canAccessTicket, populateTicket, getTicketOrThrow };
