import api from "./api";
const adminService = {
  getDashboard: async () => (await api.get("/admin/dashboard")).data,
  getAgents: async () => (await api.get("/admin/agents")).data,
  createAgent: async (p) => (await api.post("/admin/agents", p)).data,
  updateAgent: async (id, p) =>
    (await api.patch(`/admin/agents/${id}`, p)).data,
  getCategories: async () => (await api.get("/admin/categories")).data,
  createCategory: async (p) => (await api.post("/admin/categories", p)).data,
  deleteCategory: async (id) =>
    (await api.delete(`/admin/categories/${id}`)).data,
  updateRole: async (id, role) =>
    (await api.patch(`/admin/users/${id}/role`, { role })).data,
  setStatus: async (id, isActive) =>
    (await api.patch(`/admin/users/${id}/status`, { isActive })).data,
};
export default adminService;
