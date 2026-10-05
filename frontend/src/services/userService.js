import api from "./api";
const userService = {
  getUsers: async (p) => (await api.get("/users", { params: p })).data,
  getUser: async (id) => (await api.get(`/users/${id}`)).data,
  updateUser: async (id, p) => (await api.patch(`/users/${id}`, p)).data,
  deleteUser: async (id) => (await api.delete(`/users/${id}`)).data,
  updateProfile: async (id, p) => (await api.patch(`/users/${id}`, p)).data,
};
export default userService;
