import api from "./api";
const aiService = {
  answer: async (question) => (await api.post("/ai/answer", { question })).data,
};
export default aiService;
