const express = require("express");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { commentValidation } = require("../validations/comment.validation");
const c = require("../controllers/comment.controller");

const router = express.Router();
router.use(protect);
router.get("/ticket/:ticketId", c.getComments);
router.post("/ticket/:ticketId", validate(commentValidation), c.createComment);
router.delete("/:id", c.deleteComment);

module.exports = router;
