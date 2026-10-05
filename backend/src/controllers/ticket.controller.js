const Ticket = require("../models/Ticket");
const User = require("../models/User");
const { success, failure } = require("../utils/response");
const { getPagination, getMeta } = require("../utils/pagination");
const {
  log,
  canAccessTicket,
  populateTicket,
} = require("../services/ticket.service");
const { createNotification } = require("../services/notification.service");
const { calculateDueAt } = require("../services/sla.service");
const { emitTicket } = require("../services/realtime.service");
const getTickets = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = {};
    if (req.user.role === "user") filter.createdBy = req.user.id;
    if (req.user.role === "agent") {
      filter.assignedTo = req.user.id;
    }
    if (req.query.assignedTo === "me" && req.user.role === "agent")
      filter.assignedTo = req.user.id;
    else if (req.query.assignedTo && req.user.role === "admin")
      filter.assignedTo = req.query.assignedTo;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search)
      filter.$text = { $search: String(req.query.search).slice(0, 100) };
    const [items, total] = await Promise.all([
      populateTicket(
        Ticket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ),
      Ticket.countDocuments(filter),
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
const getTicket = async (req, res, next) => {
  try {
    const ticket = await populateTicket(Ticket.findById(req.params.id));
    if (!ticket) return failure(res, "Ticket not found", 404);
    if (!canAccessTicket(ticket, req.user))
      return failure(res, "Access denied", 403);
    return success(res, ticket);
  } catch (e) {
    next(e);
  }
};
const createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      priority: req.body.priority || "medium",
      category: req.body.category || null,
      createdBy: req.user.id,
    });
    ticket.slaDueAt = calculateDueAt(ticket.priority, ticket.createdAt);
    await ticket.save();
    await log(
      req.user.id,
      "ticket.created",
      `Ticket "${ticket.title}" created`,
      ticket._id,
    );
    const populated = await populateTicket(Ticket.findById(ticket._id));
    return success(res, populated, "Ticket created", 201);
  } catch (e) {
    next(e);
  }
};
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return failure(res, "Ticket not found", 404);
    if (!canAccessTicket(ticket, req.user))
      return failure(res, "Access denied", 403);
    if (
      req.user.role === "user" &&
      ["status", "assignedTo"].some((k) => req.body[k] !== undefined)
    )
      return failure(res, "Customers cannot change status or assignment", 403);
    const oldAssigned = String(ticket.assignedTo || "");
    const oldStatus = ticket.status;
    for (const key of [
      "title",
      "description",
      "priority",
      "category",
      "status",
      "assignedTo",
    ])
      if (req.body[key] !== undefined) ticket[key] = req.body[key];
    if (
      ticket.priority !== undefined &&
      ticket.priority !== undefined &&
      ticket.isModified("priority")
    )
      ticket.slaDueAt = calculateDueAt(ticket.priority, ticket.createdAt);
    if (ticket.status === "resolved" && !ticket.resolvedAt)
      ticket.resolvedAt = new Date();
    if (ticket.status === "closed" && !ticket.closedAt)
      ticket.closedAt = new Date();
    if (ticket.status !== "closed") ticket.closedAt = null;
    if (ticket.status !== "resolved") ticket.resolvedAt = null;
    await ticket.save();
    if (
      !ticket.firstResponseAt &&
      req.user.role === "agent" &&
      oldStatus === "open" &&
      ticket.status !== "open"
    ) {
      ticket.firstResponseAt = new Date();
      await ticket.save();
    }
    if (ticket.assignedTo && String(ticket.assignedTo) !== oldAssigned) {
      await createNotification(
        ticket.assignedTo,
        "Ticket assigned",
        `Ticket "${ticket.title}" was assigned to you`,
        "ticket",
        `/tickets/${ticket._id}`,
      );
    }
    await log(
      req.user.id,
      "ticket.updated",
      `Ticket "${ticket.title}" updated`,
      ticket._id,
    );
    const populated = await populateTicket(Ticket.findById(ticket._id));
    emitTicket(req.app.get("io"), ticket._id, "ticket:updated", populated);
    return success(res, populated, "Ticket updated");
  } catch (e) {
    next(e);
  }
};
const assignTicket = async (req, res, next) => {
  try {
    const agent = await User.findOne({
      _id: req.body.assignedTo,
      role: { $in: ["agent", "admin"] },
      isActive: true,
    });
    if (!agent) return failure(res, "Valid agent/admin not found", 404);
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return failure(res, "Ticket not found", 404);
    ticket.assignedTo = agent._id;
    ticket.status = req.body.status || "in-progress";
    await ticket.save();
    await createNotification(
      agent._id,
      "Ticket assigned",
      `Ticket "${ticket.title}" was assigned to you`,
      "ticket",
      `/tickets/${ticket._id}`,
    );
    await log(
      req.user.id,
      "ticket.assigned",
      `Ticket assigned to ${agent.email}`,
      ticket._id,
    );
    return success(
      res,
      await populateTicket(Ticket.findById(ticket._id)),
      "Ticket assigned",
    );
  } catch (e) {
    next(e);
  }
};
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return failure(res, "Ticket not found", 404);
    if (
      req.user.role !== "admin" &&
      String(ticket.createdBy) !== String(req.user.id)
    )
      return failure(res, "Access denied", 403);
    await Promise.all([
      require("../models/Comment").deleteMany({ ticket: ticket._id }),
      require("../models/Attachment").deleteMany({ ticket: ticket._id }),
    ]);
    await ticket.deleteOne();
    await log(
      req.user.id,
      "ticket.deleted",
      `Ticket "${ticket.title}" deleted`,
      ticket._id,
    );
    return success(res, null, "Ticket deleted");
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  assignTicket,
  deleteTicket,
};
