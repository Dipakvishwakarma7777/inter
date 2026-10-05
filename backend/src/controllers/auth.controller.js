const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { createUser, authenticateUser } = require("../services/auth.service");
const { success, failure } = require("../utils/response");
const env = require("../config/env");
const cookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
const issue = (res, user) => {
  const token = generateToken(user);
  res.cookie("token", token, cookieOptions());
  return token;
};
const register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const token = issue(res, user);
    return success(res, { user, token }, "Registration successful", 201);
  } catch (e) {
    next(e);
  }
};
const login = async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body.email, req.body.password);
    if (!user) return failure(res, "Invalid email or password", 401);
    if (!user.isActive) return failure(res, "Account is inactive", 403);
    const token = issue(res, user);
    return success(res, { user, token }, "Login successful");
  } catch (e) {
    next(e);
  }
};
const logout = (req, res) => {
  res.clearCookie("token", { ...cookieOptions(), maxAge: 0 });
  return success(res, null, "Logout successful");
};
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return failure(res, "User not found", 404);
    return success(res, user);
  } catch (e) {
    next(e);
  }
};
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
    }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");
    if (!user)
      return success(
        res,
        { resetUrl: null },
        "If the account exists, a reset link is available for local testing",
      );
    const raw = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = crypto
      .createHash("sha256")
      .update(raw)
      .digest("hex");
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${raw}`;
    return success(
      res,
      { resetUrl, expiresInMinutes: 15 },
      "Password reset link generated for local testing",
    );
  } catch (e) {
    next(e);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const hash = crypto
      .createHash("sha256")
      .update(req.body.token || "")
      .digest("hex");
    const user = await User.findOne({
      resetPasswordTokenHash: hash,
      resetPasswordExpiresAt: { $gt: new Date() },
    }).select("+resetPasswordTokenHash +resetPasswordExpiresAt +password");
    if (!user) return failure(res, "Invalid or expired reset token", 400);
    const { hashPassword } = require("../utils/password");
    user.password = await hashPassword(req.body.password);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;
    await user.save();
    return success(res, null, "Password reset successful");
  } catch (e) {
    next(e);
  }
};
module.exports = { register, login, logout, me, forgotPassword, resetPassword };
