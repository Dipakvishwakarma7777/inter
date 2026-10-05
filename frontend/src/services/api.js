import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  timeout: 15000,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("supportdesk_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem("supportdesk_user");
      localStorage.removeItem("supportdesk_token");
    }
    return Promise.reject(e);
  },
);
export default api;
