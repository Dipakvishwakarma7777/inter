const crypto = require("crypto");

const requestId = (req, res, next) => {
  const id = crypto.randomUUID();
  req.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
};

module.exports = { requestId };
