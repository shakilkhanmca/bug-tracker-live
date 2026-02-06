import axios from "axios";

const API_URL = "https://bug-tracker-live.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers["Authorization"] = "Bearer " + user.token;
    }
    return config;
  },
  (error) => {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || "An unexpected error occurred";
    // Avoid double toast for common errors if handled locally, but global safety is good
    // import { toast } from "react-toastify"; // Need to import outside or use a custom event
    // Since api.js is a module, we can import toast.
    // However, checking circular deps.
    // Let's assume toast is safe.
    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

export default api;
