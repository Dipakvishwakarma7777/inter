const express = require("express");
const protect = require("../middleware/auth.middleware");
const c = require("../controllers/notification.controller");

const router = express.Router();
router.use(protect);
router.get("/", c.getNotifications);
router.patch("/:id/read", c.markRead);
router.patch("/read-all", c.markAllRead);
router.delete("/:id", c.deleteNotification);

module.exports = router;
