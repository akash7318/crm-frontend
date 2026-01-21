import axios from "axios";

// Set base URL for all axios requests
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// Include credentials (cookies) on cross-site requests — equivalent to fetch's `credentials: "include"`
axios.defaults.withCredentials = true;

// Add request interceptor for authentication headers
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
