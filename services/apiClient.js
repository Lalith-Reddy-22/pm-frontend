const API_URL = "http://localhost:5234/api/v1";

export async function apiClient(endpoint, options = {}) {
  let token = null;

  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("accessToken");
  }

  const url = `${API_URL}${endpoint}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

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
}