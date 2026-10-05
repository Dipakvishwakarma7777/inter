import api from "./api";
const ticketService = {
  getTickets: async (params = {}) =>
    (await api.get("/tickets", { params })).data,
  getTicket: async (id) => (await api.get(`/tickets/${id}`)).data,
  createTicket: async (p) => (await api.post("/tickets", p)).data,
  updateTicket: async (id, p) => (await api.patch(`/tickets/${id}`, p)).data,
  deleteTicket: async (id) => (await api.delete(`/tickets/${id}`)).data,
  assignTicket: async (id, p) =>
    (await api.patch(`/tickets/${id}/assign`, p)).data,
  getComments: async (id) => (await api.get(`/comments/ticket/${id}`)).data,
  addComment: async (id, message) =>
    (await api.post(`/comments/ticket/${id}`, { message })).data,
  deleteComment: async (id) => (await api.delete(`/comments/${id}`)).data,
  getAttachments: async (id) =>
    (await api.get(`/attachments/ticket/${id}`)).data,
  uploadAttachment: async (id, file) => {
    const fd = new FormData();
    fd.append("file", file);
    return (
      await api.post(`/attachments/ticket/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },
  deleteAttachment: async (id) => (await api.delete(`/attachments/${id}`)).data,
  downloadAttachment: async (id, fileName) => {
    const response = await api.get(`/attachments/${id}/download`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
export default ticketService;
