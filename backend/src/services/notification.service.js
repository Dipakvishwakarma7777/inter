const Notification = require("../models/Notification");
const createNotification = (user, title, message, type = "system", link = "") =>
  Notification.create({ user, title, message, type, link });
const notifyMany = async (
  users,
  title,
  message,
  type = "system",
  link = "",
) => {
  const ids = users.map((u) => u._id || u).filter(Boolean);
  return ids.length
    ? Notification.insertMany(
        ids.map((user) => ({ user, title, message, type, link })),
      )
    : [];
};
module.exports = { createNotification, notifyMany };
