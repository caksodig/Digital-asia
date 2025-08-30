import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor untuk error handling global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }

      // Redirect ke login dengan pengecekan lebih robust
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        !window.location.pathname.includes("/login")
      ) {
        if (window.history && window.history.pushState) {
          window.history.pushState(null, "", "/login");
          window.dispatchEvent(new PopStateEvent("popstate"));
        } else {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
