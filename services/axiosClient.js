import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

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

// =====================================================
// RESPONSE INTERCEPTOR
// 401 → REFRESH TOKEN → RETRY REQUEST
// =====================================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !isLoginRequest
    ) {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (originalRequest?.url?.includes("/auth/refresh")) {
      sessionStorage.clear();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
      sessionStorage.clear();
      window.location.href = "/login";

      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newAccessToken) => {
        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log(
        "ACCESS TOKEN EXPIRED - REFRESHING TOKEN"
      );

      const refreshResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
        {
          refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = refreshResponse.data;

      console.log(
        "REFRESH TOKEN API RESPONSE:",
        data
      );

      const newAccessToken = data?.accessToken;
      const newRefreshToken = data?.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error(
          "Refresh API did not return valid access and refresh tokens."
        );
      }

      sessionStorage.setItem(
        "accessToken",
        newAccessToken
      );

      sessionStorage.setItem(
        "refreshToken",
        newRefreshToken
      );

      console.log("NEW ACCESS TOKEN STORED");
      console.log("NEW REFRESH TOKEN STORED");

      processQueue(null, newAccessToken);

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);
    } catch (refreshError) {
      console.error(
        "REFRESH TOKEN FAILED:",
        refreshError.response?.data ||
          refreshError.message
      );

      processQueue(refreshError, null);

      sessionStorage.clear();
      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;