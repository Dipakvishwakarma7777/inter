process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-secret-not-for-production";

const request = require("supertest");
const app = require("../src/app");

describe("API integration contract", () => {
  test("health and API discovery routes are available", async () => {
    await request(app).get("/health").expect(200).expect(({ body }) => {
      expect(body).toMatchObject({ success: true, status: "ok" });
    });
    await request(app).get("/api").expect(200).expect(({ body }) => {
      expect(body).toMatchObject({ success: true, message: "SupportDesk API" });
    });
  });

  test.each([
    ["get", "/api/auth/me"],
    ["get", "/api/users"],
    ["get", "/api/users/507f1f77bcf86cd799439011"],
    ["patch", "/api/users/507f1f77bcf86cd799439011"],
    ["delete", "/api/users/507f1f77bcf86cd799439011"],
    ["get", "/api/tickets"],
    ["post", "/api/tickets"],
    ["get", "/api/tickets/507f1f77bcf86cd799439011"],
    ["patch", "/api/tickets/507f1f77bcf86cd799439011"],
    ["patch", "/api/tickets/507f1f77bcf86cd799439011/assign"],
    ["delete", "/api/tickets/507f1f77bcf86cd799439011"],
    ["get", "/api/categories"],
    ["post", "/api/categories"],
    ["patch", "/api/categories/507f1f77bcf86cd799439011"],
    ["delete", "/api/categories/507f1f77bcf86cd799439011"],
    ["get", "/api/comments/ticket/507f1f77bcf86cd799439011"],
    ["post", "/api/comments/ticket/507f1f77bcf86cd799439011"],
    ["delete", "/api/comments/507f1f77bcf86cd799439011"],
    ["get", "/api/attachments/ticket/507f1f77bcf86cd799439011"],
    ["post", "/api/attachments/ticket/507f1f77bcf86cd799439011"],
    ["get", "/api/attachments/507f1f77bcf86cd799439011/download"],
    ["delete", "/api/attachments/507f1f77bcf86cd799439011"],
    ["get", "/api/notifications"],
    ["patch", "/api/notifications/507f1f77bcf86cd799439011/read"],
    ["patch", "/api/notifications/read-all"],
    ["delete", "/api/notifications/507f1f77bcf86cd799439011"],
    ["get", "/api/dashboard"],
    ["get", "/api/admin/dashboard"],
    ["get", "/api/admin/agents"],
    ["post", "/api/admin/agents"],
    ["patch", "/api/admin/agents/507f1f77bcf86cd799439011"],
    ["get", "/api/admin/categories"],
    ["post", "/api/admin/categories"],
    ["delete", "/api/admin/categories/507f1f77bcf86cd799439011"],
    ["patch", "/api/admin/users/507f1f77bcf86cd799439011/role"],
    ["patch", "/api/admin/users/507f1f77bcf86cd799439011/status"],
    ["get", "/api/admin/activity-logs"],
    ["get", "/api/search?q=ticket"],
    ["get", "/api/analytics"],
    ["get", "/api/knowledge"],
    ["get", "/api/knowledge/507f1f77bcf86cd799439011"],
    ["post", "/api/knowledge"],
    ["patch", "/api/knowledge/507f1f77bcf86cd799439011"],
    ["delete", "/api/knowledge/507f1f77bcf86cd799439011"],
    ["post", "/api/ai/answer"],
  ])("%s %s is mounted and requires authentication", async (method, path) => {
    const response = await request(app)[method](path);
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: "Authentication required",
    });
  });

  test("registration rejects passwords below the backend minimum", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "short" });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContain("Password must be 8-128 characters");
  });

  test("agent creation validates credentials before reaching the database", async () => {
    const response = await request(app)
      .post("/api/admin/agents")
      .set(
        "Authorization",
        `Bearer ${require("jsonwebtoken").sign(
          { id: "507f1f77bcf86cd799439011", role: "admin" },
          process.env.JWT_SECRET,
        )}`,
      )
      .send({ name: "Test Agent", email: "agent@example.com", password: "short" });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContain("Password must be 8-128 characters");
  });

  test("unknown API routes return a JSON 404", async () => {
    const response = await request(app).get("/api/not-a-route");
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      message: "Route not found",
    });
  });
});
