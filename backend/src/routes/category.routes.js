const express = require("express");
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const validate = require("../middleware/validation.middleware");
const { categoryValidation } = require("../validations/category.validation");
const c = require("../controllers/category.controller");
const router = express.Router();
router.get("/", protect, c.getCategories);
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(categoryValidation),
  c.createCategory,
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  validate(categoryValidation),
  c.updateCategory,
);
router.delete("/:id", protect, authorize("admin"), c.deleteCategory);
module.exports = router;
