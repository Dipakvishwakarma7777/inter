const env = require("../config/env");
const Ticket = require("../models/Ticket");
const hoursFor = (priority) => env.SLA_HOURS[priority] || 48;
const calculateDueAt = (priority, from = new Date()) =>
  new Date(from.getTime() + hoursFor(priority) * 60 * 60 * 1000);
const applySla = async (ticket) => {
  ticket.slaDueAt = calculateDueAt(
    ticket.priority,
    ticket.createdAt || new Date(),
  );
  return ticket;
};
const refreshBreaches = async () =>
  Ticket.updateMany(
    {
      slaDueAt: { $lt: new Date() },
      status: { $nin: ["resolved", "closed"] },
      slaBreached: false,
    },
    { $set: { slaBreached: true } },
  );
module.exports = { calculateDueAt, applySla, refreshBreaches };
