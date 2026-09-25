export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
}

export function normalizeApiError(error, fallbackMessage = "Request failed.") {
  if (error instanceof Error) {
    const message = error.message?.trim();
    if (message) return message;
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (error && typeof error === "object") {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.data?.message ||
      error.data?.title ||
      error.message;

    if (message) return message;
  }

  return fallbackMessage;
}

export async function requestJson(url, options = {}) {
  const token = getAuthToken();

  const response = await fetch(url, {
    method: "GET",
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let payload = null;
  try {
    payload = isJson ? await response.json() : await response.text();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.title ||
      payload?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message || "Request failed.");
  }

  return payload;
}
