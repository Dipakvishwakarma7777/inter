const express = require("express");
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validation.middleware");
const { ticketValidation } = require("../validations/ticket.validation");
const c = require("../controllers/ticket.controller");

const router = express.Router();
router.use(protect);
router.get("/", c.getTickets);
router.post("/", validate(ticketValidation), c.createTicket);
router.get("/:id", c.getTicket);
router.patch("/:id", validate(ticketValidation), c.updateTicket);
router.patch("/:id/assign", authorize("admin", "agent"), c.assignTicket);
router.delete("/:id", c.deleteTicket);

module.exports = router;
