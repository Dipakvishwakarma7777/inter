import api from "./api";
const analyticsService = {
  get: async () => (await api.get("/analytics")).data,
};
export default analyticsService;
