const { canAccessTicket } = require("../src/services/ticket.service");

describe("ticket access", () => {
  const ownerId = "507f1f77bcf86cd799439011";
  const assignedAgentId = "507f1f77bcf86cd799439012";
  const otherAgentId = "507f1f77bcf86cd799439013";
  const ticket = { createdBy: ownerId, assignedTo: assignedAgentId };

  test("allows admins to access any ticket", () => {
    expect(canAccessTicket(ticket, { id: otherAgentId, role: "admin" })).toBe(
      true,
    );
  });

  test("limits agents to tickets assigned to them", () => {
    expect(
      canAccessTicket(ticket, { id: assignedAgentId, role: "agent" }),
    ).toBe(true);
    expect(canAccessTicket(ticket, { id: otherAgentId, role: "agent" })).toBe(
      false,
    );
  });

  test("limits customers to tickets they created", () => {
    expect(canAccessTicket(ticket, { id: ownerId, role: "user" })).toBe(true);
    expect(canAccessTicket(ticket, { id: otherAgentId, role: "user" })).toBe(
      false,
    );
  });

  test("supports populated ticket references", () => {
    expect(
      canAccessTicket(
        {
          createdBy: { _id: ownerId },
          assignedTo: { _id: assignedAgentId },
        },
        { id: assignedAgentId, role: "agent" },
      ),
    ).toBe(true);
  });
});
