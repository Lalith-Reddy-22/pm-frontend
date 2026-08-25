import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/authSlice";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// JWT
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Errors — auto-logout on 401 (expired / invalid token)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      store.dispatch(logout());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;