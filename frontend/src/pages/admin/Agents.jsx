import { useEffect, useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import adminService from "../../services/adminService";
export default function Agents() {
  const [agents, setAgents] = useState([]),
    [open, setOpen] = useState(false),
    [form, setForm] = useState({ name: "", email: "", password: "" });
  const load = async () => {
    const r = await adminService.getAgents();
    setAgents(r.agents || r.data || r || []);
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    await adminService.createAgent(form);
    setOpen(false);
    setForm({ name: "", email: "", password: "" });
    load();
  };
  return (
    <>
      <DashboardHeader
        title="Agents"
        description="Create and manage support agents."
        action={<Button onClick={() => setOpen(true)}>Add Agent</Button>}
      />
      <div className="section-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a._id || a.id}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.isActive === false ? "Inactive" : "Active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Agent">
        <form onSubmit={create}>
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Temporary Password"
            type="password"
            minLength={8}
            maxLength={128}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit">Create Agent</Button>
        </form>
      </Modal>
    </>
  );
}
