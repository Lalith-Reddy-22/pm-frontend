const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const RATE_CARD_BASE_URL =
  process.env.NEXT_PUBLIC_RATE_CARD_API_URL ||
  "http://localhost:5000/api";

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token")
  );
}

function dispatchSessionTimeout() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("session:timeout"));
  }
}

async function request(
  endpoint,
  options = {},
  baseUrl = BASE_URL
) {
  if (!BASE_URL) {
    console.warn(
      "API base URL is not configured. Skipping request:",
      endpoint
    );
    return null;
  }

  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const url = `${baseUrl}${endpoint}`;

    console.log("=================================");
    console.log("API BASE URL:", BASE_URL);
    console.log("API ENDPOINT:", endpoint);
    console.log("API FINAL URL:", url);
    console.log("API METHOD:", options.method);
    console.log("=================================");

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      dispatchSessionTimeout();

      return new Promise(() => {});
    }

    const contentType = res.headers.get("content-type");

    const data = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      console.error("API ERROR STATUS:", res.status);
      console.error("API ERROR RESPONSE:", data);
      console.error("API FAILED URL:", url);

      const message =
        data?.message ||
        data?.title ||
        data?.detail ||
        (typeof data === "string"
          ? data
          : JSON.stringify(data)) ||
        `Request failed: ${res.status}`;

      throw new Error(message);
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to reach the API server. Please confirm the backend is running and NEXT_PUBLIC_API_URL is correct.";

    console.error("API request failed:", message);

    throw new Error(message);
  }
}

export const api = {
  get: (endpoint, options) =>
    request(endpoint, {
      method: "GET",
      ...options,
    }),

  post: (endpoint, body, options) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: (endpoint, body, options) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: (endpoint, body, options) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: (endpoint, options) =>
    request(endpoint, {
      method: "DELETE",
      ...options,
    }),
};

export const rateCardApi = {
  get: (endpoint, options) =>
    request(
      endpoint,
      {
        method: "GET",
        ...options,
      },
      RATE_CARD_BASE_URL
    ),

  post: (endpoint, body, options) =>
    request(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
        ...options,
      },
      RATE_CARD_BASE_URL
    ),
};

// user_Type mapping
const USER_TYPE_ROLE = {
  1: "admin",
  2: "pm_employee",
  3: "employee",
  4: "admin",
  5: "sys_admin",
};

export const authApi = {
  login: async (emailId, password) => {
    const data = await api.post("/auth/login", {
      emailId,
      password,
    });

    return {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      role: USER_TYPE_ROLE[data.user_Type] ?? "employee",
      empId: data.empId,
      empName: data.employee_Name,
      empNumber: data.empNumber,
      designation: data.designation,
      emailId: data.emailId,
      accessTokenExpiry: data.accessTokenExpiry,
    };
  },
};