import api from "./api";
const notificationService = {
  list: async (params = {}) =>
    (await api.get("/notifications", { params })).data,
  read: async (id) => (await api.patch(`/notifications/${id}/read`)).data,
  readAll: async () => (await api.patch("/notifications/read-all")).data,
  remove: async (id) => (await api.delete(`/notifications/${id}`)).data,
};
export default notificationService;
