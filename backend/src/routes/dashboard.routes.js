const express = require("express");
const protect = require("../middleware/auth.middleware");
const { dashboard } = require("../controllers/dashboard.controller");

const router = express.Router();
router.get("/", protect, dashboard);

module.exports = router;
