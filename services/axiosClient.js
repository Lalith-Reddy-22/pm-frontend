import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5234/api/v1",
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
       
      console.log("ACCESS TOKEN EXISTS:", !!token);
      console.log("ACCESS TOKEN:", token);

      if (token) {
        config.headers = config.headers || {};        
        config.headers.Authorization = `Bearer ${token}`;

        console.log("AUTH HEADER:", config.headers.Authorization);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosClient;