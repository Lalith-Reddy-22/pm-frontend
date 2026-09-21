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
      // If sessionStorage has no token (e.g. page opened in a new tab),
      // restore the session from localStorage before reading the token.
      if (!sessionStorage.getItem("accessToken") && localStorage.getItem("accessToken")) {
        ["accessToken", "refreshToken", "empId", "userType", "employeeName", "email", "auth", "role"]
          .forEach((key) => {
            const val = localStorage.getItem(key);
            if (val !== null) sessionStorage.setItem(key, val);
          });
      }

      const token =
        sessionStorage.getItem("accessToken") ||
        sessionStorage.getItem("token");

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

/** Fire the session-timeout event so the modal appears instead of a hard redirect. */
function dispatchSessionTimeout() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("session:timeout"));
  }
}

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest  = originalRequest?.url?.includes("/auth/login");

    // For login 401s just reject — wrong credentials, not a timeout
    if (error.response?.status === 401 && isLoginRequest) {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Refresh token request itself failed — session is fully expired
    if (originalRequest?.url?.includes("/auth/refresh")) {
      dispatchSessionTimeout();
      return Promise.reject(error);
    }

    const refreshToken = sessionStorage.getItem("refreshToken");

    // No refresh token available — session expired
    if (!refreshToken) {
      dispatchSessionTimeout();
      return Promise.reject(error);
    }

    // Non-401 errors pass through normally
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      }).catch((err) => Promise.reject(err));
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

      const newAccessToken  = data?.accessToken;
      const newRefreshToken = data?.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Refresh API did not return valid tokens.");
      }

      sessionStorage.setItem("accessToken",  newAccessToken);
      sessionStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("accessToken",    newAccessToken);
      localStorage.setItem("refreshToken",   newRefreshToken);

      processQueue(null, newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      dispatchSessionTimeout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;