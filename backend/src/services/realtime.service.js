const emitTicket = (io, ticketId, event, payload) => {
  if (!io) return;
  io.to(`ticket:${ticketId}`).emit(event, payload);
};
const emitUser = (io, userId, event, payload) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
};
module.exports = { emitTicket, emitUser };
