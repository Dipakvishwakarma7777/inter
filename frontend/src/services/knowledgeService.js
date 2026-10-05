import api from "./api";
const knowledgeService = {
  list: async (q) =>
    (await api.get("/knowledge", { params: q ? { q } : {} })).data,
  get: async (id) => (await api.get(`/knowledge/${id}`)).data,
  create: async (p) => (await api.post("/knowledge", p)).data,
  update: async (id, p) => (await api.patch(`/knowledge/${id}`, p)).data,
  remove: async (id) => (await api.delete(`/knowledge/${id}`)).data,
};
export default knowledgeService;
