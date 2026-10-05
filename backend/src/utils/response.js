const success = (res, data = null, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const failure = (
  res,
  message = "Request failed",
  statusCode = 400,
  errors = null,
) =>
  res
    .status(statusCode)
    .json({ success: false, message, ...(errors ? { errors } : {}) });

module.exports = { success, failure };
