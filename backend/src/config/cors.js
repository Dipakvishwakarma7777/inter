const env = require("./env");

const allowedOrigins = (env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((item) => item.trim());

module.exports = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      env.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Disposition"],
};
