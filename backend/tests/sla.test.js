jest.mock("../src/models/Ticket",()=>({updateMany:jest.fn()}));const {calculateDueAt,refreshBreaches}=require("../src/services/sla.service");
test("SLA due date is based on priority",()=>{const from=new Date("2026-01-01T00:00:00Z");expect(calculateDueAt("urgent",from).toISOString()).toBe("2026-01-01T08:00:00.000Z");});
test("refreshBreaches calls the expected query",async()=>{await refreshBreaches();expect(require("../src/models/Ticket").updateMany).toHaveBeenCalled();});
