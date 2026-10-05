const {registerValidation}=require("../src/validations/auth.validation");const {ticketValidation}=require("../src/validations/ticket.validation");
test("rejects weak registration passwords",()=>expect(registerValidation({name:"Dipak",email:"a@example.com",password:"short"}).length).toBeGreaterThan(0));
test("accepts valid ticket fields",()=>expect(ticketValidation({title:"Printer issue",description:"Cannot print",priority:"high"})).toEqual([]));
test("rejects invalid ticket status",()=>expect(ticketValidation({status:"pending"})).toContain("Invalid status"));
