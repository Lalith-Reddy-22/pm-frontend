const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5234";

function getToken() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("accessToken") || sessionStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token expired or invalid — clear session and redirect to login
    sessionStorage.clear();
    window.location.href = "/login";
    return;
  }

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message = data?.message || data?.title || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: "GET", ...options }),

  post: (endpoint, body, options) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body), ...options }),

  put: (endpoint, body, options) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body), ...options }),

  patch: (endpoint, body, options) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body), ...options }),

  delete: (endpoint, options) => request(endpoint, { method: "DELETE", ...options }),
};

// ── Auth ──────────────────────────────────────────────────────────────────────
// user_Type mapping: 1 = admin, 2 = pm_employee, 3 = employee, 4 = admin, 5 = sys_admin
const USER_TYPE_ROLE = {
  1: "admin",
  2: "pm_employee",
  3: "employee",
  4: "admin",
  5: "sys_admin",
};

export const authApi = {
  login: async (emailId, password) => {
    const data = await api.post("/api/v1/auth/login", { emailId, password });
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
