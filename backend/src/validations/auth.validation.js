const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const password = (value) =>
  typeof value === "string" && value.length >= 8 && value.length <= 128;
const registerValidation = (body) => {
  const errors = [];
  if (!body.name?.trim() || body.name.trim().length < 2)
    errors.push("Name must be at least 2 characters");
  if (!email.test(String(body.email || "").trim()))
    errors.push("Valid email is required");
  if (!password(body.password))
    errors.push("Password must be 8-128 characters");
  return errors;
};
const loginValidation = (body) => {
  const errors = [];
  if (!email.test(String(body.email || "").trim()))
    errors.push("Valid email is required");
  if (!body.password) errors.push("Password is required");
  return errors;
};
const forgotPasswordValidation = (body) =>
  email.test(String(body.email || "").trim())
    ? []
    : ["Valid email is required"];
const resetPasswordValidation = (body) =>
  password(body.password) ? [] : ["Password must be 8-128 characters"];
module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
