const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const { success, failure } = require("../utils/response");
const { canAccessTicket, log } = require("../services/ticket.service");
const { createNotification } = require("../services/notification.service");
const { emitTicket } = require("../services/realtime.service");
const getComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return failure(res, "Ticket not found", 404);
    if (!canAccessTicket(ticket, req.user))
      return failure(res, "Access denied", 403);
    return success(
      res,
      await Comment.find({ ticket: ticket._id })
        .populate("user", "name email role")
        .sort({ createdAt: 1 }),
    );
  } catch (e) {
    next(e);
  }
};
const createComment = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate(
      "createdBy assignedTo",
      "email",
    );
    if (!ticket) return failure(res, "Ticket not found", 404);
    if (!canAccessTicket(ticket, req.user))
      return failure(res, "Access denied", 403);
    const comment = await Comment.create({
      ticket: ticket._id,
      user: req.user.id,
      message: req.body.message.trim(),
    });
    if (!ticket.firstResponseAt && req.user.role === "agent") {
      ticket.firstResponseAt = new Date();
      await ticket.save();
    }
    const recipients = [
      ticket.createdBy?.email ? ticket.createdBy : null,
      ticket.assignedTo?.email ? ticket.assignedTo : null,
    ]
      .filter(Boolean)
      .filter((u) => String(u._id) !== String(req.user.id));
    for (const u of recipients) {
      await createNotification(
        u._id,
        "New ticket comment",
        `A new comment was added to "${ticket.title}"`,
        "comment",
        `/tickets/${ticket._id}`,
      );
    }
    await log(req.user.id, "comment.created", "Comment added", ticket._id);
    const populated = await comment.populate("user", "name email role");
    emitTicket(req.app.get("io"), ticket._id, "comment:created", populated);
    return success(res, populated, "Comment added", 201);
  } catch (e) {
    next(e);
  }
};
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return failure(res, "Comment not found", 404);
    if (
      req.user.role !== "admin" &&
      String(comment.user) !== String(req.user.id)
    )
      return failure(res, "Access denied", 403);
    await comment.deleteOne();
    return success(res, null, "Comment deleted");
  } catch (e) {
    next(e);
  }
};
module.exports = { getComments, createComment, deleteComment };
