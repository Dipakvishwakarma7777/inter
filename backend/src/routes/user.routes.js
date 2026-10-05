const express = require("express");
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const c = require("../controllers/user.controller");

const router = express.Router();
router.use(protect);
router.get("/", authorize("admin", "agent"), c.getUsers);
router.get("/:id", c.getUser);
router.patch("/:id", c.updateUser);
router.patch("/:id/password", c.changePassword);
router.delete("/:id", authorize("admin"), c.deleteUser);

module.exports = router;
