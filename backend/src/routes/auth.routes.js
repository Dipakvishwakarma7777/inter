const express = require("express");
const {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/auth.validation");
const router = express.Router();
router.post("/register", authLimiter, validate(registerValidation), register);
router.post("/login", authLimiter, validate(loginValidation), login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordValidation),
  forgotPassword,
);
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordValidation),
  resetPassword,
);
module.exports = router;
