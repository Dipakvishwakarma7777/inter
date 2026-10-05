jest.mock("../src/models/Ticket", () => ({
  countDocuments: jest.fn(),
}));
jest.mock("../src/models/User", () => ({
  countDocuments: jest.fn(),
}));
jest.mock("../src/models/Category", () => ({
  countDocuments: jest.fn(),
}));

const Ticket = require("../src/models/Ticket");
const User = require("../src/models/User");
const Category = require("../src/models/Category");
const { getDashboard } = require("../src/services/dashboard.service");

describe("dashboard aggregation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns ticket totals scoped to a customer", async () => {
    Ticket.countDocuments
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(5);

    await expect(
      getDashboard({ id: "customer-id", role: "user" }),
    ).resolves.toEqual({
      tickets: {
        total: 10,
        open: 4,
        inProgress: 2,
        resolved: 3,
        closed: 1,
        urgent: 5,
      },
    });
    expect(Ticket.countDocuments.mock.calls.map(([filter]) => filter)).toEqual([
      { createdBy: "customer-id" },
      { createdBy: "customer-id", status: "open" },
      { createdBy: "customer-id", status: "in-progress" },
      { createdBy: "customer-id", status: "resolved" },
      { createdBy: "customer-id", status: "closed" },
      { createdBy: "customer-id", priority: "urgent" },
    ]);
    expect(User.countDocuments).not.toHaveBeenCalled();
    expect(Category.countDocuments).not.toHaveBeenCalled();
  });

  test("returns agent-scoped counts and related metrics", async () => {
    Ticket.countDocuments
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(4);
    User.countDocuments.mockResolvedValue(6);
    Category.countDocuments.mockResolvedValue(7);

    const result = await getDashboard({ id: "agent-id", role: "agent" });

    expect(result).toEqual({
      tickets: {
        total: 8,
        open: 3,
        inProgress: 2,
        resolved: 1,
        closed: 2,
        urgent: 4,
      },
      users: 6,
      categories: 7,
    });
    expect(
      Ticket.countDocuments.mock.calls
        .slice(0, 6)
        .every(([filter]) => filter.assignedTo === "agent-id"),
    ).toBe(true);
  });
});
