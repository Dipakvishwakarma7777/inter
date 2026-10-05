const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const corsOptions = require("./config/cors");
const authRoutes = require("./routes/auth.routes"),
  userRoutes = require("./routes/user.routes"),
  ticketRoutes = require("./routes/ticket.routes"),
  categoryRoutes = require("./routes/category.routes"),
  commentRoutes = require("./routes/comment.routes"),
  attachmentRoutes = require("./routes/attachment.routes"),
  notificationRoutes = require("./routes/notification.routes"),
  dashboardRoutes = require("./routes/dashboard.routes"),
  adminRoutes = require("./routes/admin.routes"),
  searchRoutes = require("./routes/search.routes"),
  analyticsRoutes = require("./routes/analytics.routes"),
  knowledgeRoutes = require("./routes/knowledge.routes"),
  aiRoutes = require("./routes/ai.routes");
const { apiLimiter } = require("./middleware/rateLimit.middleware");
const errorHandler = require("./middleware/error.middleware");
const { requestId } = require("./middleware/security.middleware");
const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(requestId);
app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());
app.use(apiLimiter);

app.get("/health", (req, res) =>
  res.json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  }),
);
app.get("/", (req, res) =>
  res.json({ success: true, message: "SupportDesk API is running" }),
);
app.get("/api", (req, res) =>
  res.json({ success: true, message: "SupportDesk API" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/ai", aiRoutes);
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestId: req.requestId,
  }),
);
app.use(errorHandler);
module.exports = app;
