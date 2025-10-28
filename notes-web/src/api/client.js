import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // set true only if your backend uses cookies (CORS needed)
  timeout: 10000,
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
