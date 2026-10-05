const http = require("http");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { refreshBreaches } = require("./services/sla.service");
const { set } = require("mongoose");
const startServer = async () => {
  const missing = ["MONGODB_URI", "JWT_SECRET"].filter((key) => !env[key]);
  if (missing.length)
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  if (env.JWT_SECRET.length < 32)
    throw new Error("JWT_SECRET must be at least 32 characters");
  await connectDB();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL.split(",").map((x) => x.trim()),
      credentials: true,
    },
  });
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("Authentication required"));
      socket.user = jwt.verify(token, env.JWT_SECRET);
      next();
    } catch (e) {
      next(new Error("Invalid token"));
    }
  });
  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);
    socket.on("ticket:join", (ticketId) => socket.join(`ticket:${ticketId}`));
    socket.on("ticket:leave", (ticketId) => socket.leave(`ticket:${ticketId}`));
  });
  app.set("io", io);
  server.listen(env.PORT, () =>
    console.log(`Server running on port ${env.PORT}`),
  );
  const timer = setInterval(
    () => refreshBreaches().catch(console.error),
    15 * 60 * 1000,
  );
  timer.unref();
};
startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
