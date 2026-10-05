const express = require("express");
const protect = require("../middleware/auth.middleware");
const { aiLimiter } = require("../middleware/rateLimit.middleware");
const { answer } = require("../controllers/ai.controller");

const router = express.Router();

router.post("/answer", protect, aiLimiter, answer);

module.exports = router;
