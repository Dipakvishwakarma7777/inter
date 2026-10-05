const errorHandler = (err, req, res, next) => {
  console.error(`[${req.requestId || "-"}]`, err);
  if (err.name === "ValidationError")
    return res
      .status(422)
      .json({
        success: false,
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
        requestId: req.requestId,
      });
  if (err.name === "MulterError")
    return res
      .status(400)
      .json({ success: false, message: err.message, requestId: req.requestId });
  if (err.code === 11000)
    return res
      .status(409)
      .json({
        success: false,
        message: `Duplicate value for ${Object.keys(err.keyPattern || {}).join(", ")}`,
        requestId: req.requestId,
      });
  return res
    .status(err.statusCode || 500)
    .json({
      success: false,
      message: err.message || "Internal Server Error",
      requestId: req.requestId,
    });
};
module.exports = errorHandler;
