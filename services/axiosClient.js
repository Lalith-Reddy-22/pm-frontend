import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5234/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add JWT token to every request
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");

      console.log("AXIOS TOKEN EXISTS:", !!token);

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        "AUTH HEADER:",
        config.headers?.Authorization
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors
axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("AXIOS API ERROR");

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("URL:", error.config?.url);
      console.error("DATA:", error.response.data);
    } else {
      console.error("ERROR:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;