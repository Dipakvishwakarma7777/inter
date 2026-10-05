const Attachment = require("../models/Attachment");
const Ticket = require("../models/Ticket");
const { success, failure } = require("../utils/response");
const { removeAttachment } = require("../services/attachment.service");
const { canAccessTicket } = require("../services/ticket.service");
const uploadAttachment = async (req, res, next) => {
  try {
    if (!req.file) return failure(res, "File is required", 422);
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      require("fs").unlink(req.file.path, () => {});
      return failure(res, "Ticket not found", 404);
    }
    if (!canAccessTicket(ticket, req.user)) {
      require("fs").unlink(req.file.path, () => {});
      return failure(res, "Access denied", 403);
    }
    const attachment = await Attachment.create({
      ticket: ticket._id,
      uploadedBy: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });
    return success(res, attachment, "Attachment uploaded", 201);
  } catch (e) {
    if (req.file) require("fs").unlink(req.file.path, () => {});
    next(e);
  }
};
const getAttachments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return failure(res, "Ticket not found", 404);
    if (!canAccessTicket(ticket, req.user))
      return failure(res, "Access denied", 403);
    return success(
      res,
      await Attachment.find({ ticket: ticket._id })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 }),
    );
  } catch (e) {
    next(e);
  }
};
const downloadAttachment = async (req, res, next) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) return failure(res, "Attachment not found", 404);
    const ticket = await Ticket.findById(attachment.ticket);
    if (!ticket) return failure(res, "Ticket not found", 404);
    const accessUser =
      req.user ||
      (() => {
        try {
          return require("jsonwebtoken").verify(
            req.query.token || "",
            require("../config/env").JWT_SECRET,
          );
        } catch {
          return null;
        }
      })();
    if (!accessUser || !canAccessTicket(ticket, accessUser))
      return failure(res, "Access denied", 403);
    const fs = require("fs");
    if (!fs.existsSync(attachment.filePath))
      return failure(res, "File not found", 404);
    return res.download(attachment.filePath, attachment.fileName);
  } catch (e) {
    next(e);
  }
};
const deleteAttachment = async (req, res, next) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) return failure(res, "Attachment not found", 404);
    const ticket = await Ticket.findById(attachment.ticket);
    if (!ticket || !canAccessTicket(ticket, req.user))
      return failure(res, "Access denied", 403);
    if (
      req.user.role !== "admin" &&
      String(attachment.uploadedBy) !== String(req.user.id)
    )
      return failure(res, "Access denied", 403);
    await removeAttachment(attachment);
    return success(res, null, "Attachment deleted");
  } catch (e) {
    next(e);
  }
};
module.exports = {
  uploadAttachment,
  getAttachments,
  downloadAttachment,
  deleteAttachment,
};
