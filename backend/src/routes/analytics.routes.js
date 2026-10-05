const express = require("express");
const protect = require("../middleware/auth.middleware");
const { analytics } = require("../controllers/analytics.controller");
const router = express.Router();
router.get("/", protect, analytics);
module.exports = router;
