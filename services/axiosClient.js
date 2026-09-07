import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// JWT — attach token from sessionStorage on every request
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        sessionStorage.getItem("accessToken") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");
       
      console.log(
  "ACCESS TOKEN EXISTS:",
  !!token
);

console.log(
  "TOKEN PREVIEW:",
  token
    ? `${token.substring(0, 20)}...`
    : "NO TOKEN"
);

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
// Dynamic imports break the circular dependency:
//   axiosClient ← authSlice ← store ← axiosClient
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      const { store } = await import("@/store/store");
      const { logout } = await import("@/store/slices/authSlice");
      store.dispatch(logout());
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
