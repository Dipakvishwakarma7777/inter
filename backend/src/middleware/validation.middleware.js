const validate = (schema) => (req, res, next) => {
  try {
    const result = schema(req.body, req);
    if (result.length) {
      return res
        .status(422)
        .json({ success: false, message: "Validation failed", errors: result });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
