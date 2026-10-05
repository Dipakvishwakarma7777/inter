const express = require("express");
const protect = require("../middleware/auth.middleware");
const { search } = require("../controllers/search.controller");

const router = express.Router();
router.get("/", protect, search);

module.exports = router;
