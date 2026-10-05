import api from "./api";
const authService = {
  login: async (payload) => (await api.post("/auth/login", payload)).data,
  register: async (payload) => (await api.post("/auth/register", payload)).data,
  forgotPassword: async (email) =>
    (await api.post("/auth/forgot-password", { email })).data,
  resetPassword: async (payload) =>
    (await api.post("/auth/reset-password", payload)).data,
  me: async () => (await api.get("/auth/me")).data,
  logout: () => api.post("/auth/logout").catch(() => null),
};
export default authService;
