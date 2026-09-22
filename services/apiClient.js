const API_URL = "http://localhost:5234/api/v1";

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("token") ||
    null
  );
}

function getStoredRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken") ||
    null
  );
}

export async function apiClient(endpoint, options = {}) {
  const request = async (tokenOverride) => {
    const token = tokenOverride || getStoredToken();
    const url = `${API_URL}${endpoint}`;

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    console.log("=================================");
    console.log("API REQUEST");
    console.log("URL:", url);
    console.log("TOKEN EXISTS:", !!token);
    console.log("AUTH HEADER EXISTS:", !!headers.Authorization);
    console.log("=================================");

    try {
      const response = await fetch(url, {
        ...options,
        method: options.method || "GET",
        headers,
      });

      console.log("API STATUS:", response.status);
      console.log("API STATUS TEXT:", response.statusText);

      if (!response.ok) {
        const errorText = await response.text();

        if (
          response.status === 401 &&
          !endpoint.includes("/auth/login") &&
          !endpoint.includes("/auth/refresh") &&
          typeof window !== "undefined"
        ) {
          const refreshToken = getStoredRefreshToken();

          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
              });

              if (refreshResponse.ok) {
                const refreshData = JSON.parse((await refreshResponse.text()) || "{}") || {};
                const newAccessToken =
                  refreshData?.accessToken ||
                  refreshData?.token ||
                  refreshData?.data?.accessToken ||
                  refreshData?.data?.token ||
                  refreshData?.jwt ||
                  refreshData?.data?.jwt ||
                  null;

                const newRefreshToken =
                  refreshData?.refreshToken ||
                  refreshData?.refresh_token ||
                  refreshData?.data?.refreshToken ||
                  refreshData?.data?.refresh_token ||
                  refreshToken;

                if (newAccessToken) {
                  sessionStorage.setItem("accessToken", newAccessToken);
                  sessionStorage.setItem("refreshToken", newRefreshToken);
                  localStorage.setItem("accessToken", newAccessToken);
                  localStorage.setItem("refreshToken", newRefreshToken);

                  return request(newAccessToken);
                }
              }
            } catch (refreshError) {
              console.error("REFRESH TOKEN ERROR:", refreshError);
            }
          }

          window.dispatchEvent(new Event("session:timeout"));
        }

        console.error("=================================");
        console.error("API ERROR");
        console.error("URL:", url);
        console.error("STATUS:", response.status);
        console.error("STATUS TEXT:", response.statusText);
        console.error("BODY:", errorText);
        console.error("=================================");

        let message = errorText;

        try {
          const errorData = JSON.parse(errorText);
          message = errorData.message || errorData.title || errorText;
        } catch {
          // Response is not JSON
        }

        throw new Error(
          message || `API request failed with status ${response.status}`
        );
      }

      const text = await response.text();

      if (!text) {
        return null;
      }

      return JSON.parse(text);
    } catch (error) {
      console.error("API FETCH ERROR:", error);
      throw error;
    }
  };

  return request();
}