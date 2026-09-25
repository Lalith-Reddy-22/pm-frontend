export const AUTH_SESSION_KEYS = [
  "accessToken",
  "refreshToken",
  "empId",
  "userType",
  "employeeName",
  "email",
  "auth",
  "role",
  "designation",
];

export const USER_TYPE_ROLE_MAP = {
  1: "admin",
  2: "pm_employee",
  3: "employee",
  4: "admin",
  5: "sys_admin",
  6: "management_admin",
};

export function getRoleFromUserType(userType) {
  if (!userType && userType !== 0) return "";
  return USER_TYPE_ROLE_MAP[userType] || "";
}

export function readAuthSession() {
  if (typeof window === "undefined") {
    return {};
  }

  const sessionState = Object.fromEntries(
    AUTH_SESSION_KEYS.map((key) => [key, sessionStorage.getItem(key)])
  );

  const localState = Object.fromEntries(
    AUTH_SESSION_KEYS.map((key) => [key, localStorage.getItem(key)])
  );

  const source = Object.values(sessionState).some(Boolean) ? sessionState : localState;

  return {
    accessToken: source.accessToken || "",
    refreshToken: source.refreshToken || "",
    empId: source.empId || "",
    userType: source.userType || "",
    employeeName: source.employeeName || "",
    email: source.email || "",
    auth: source.auth || "",
    role: source.role || "",
    designation: source.designation || "",
  };
}

export function restoreAuthSessionFromLocalStorage() {
  if (typeof window === "undefined") return;

  const hasSessionAuth = Boolean(sessionStorage.getItem("auth"));
  const hasLocalAuth = Boolean(localStorage.getItem("auth"));

  if (hasSessionAuth || !hasLocalAuth) return;

  AUTH_SESSION_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) sessionStorage.setItem(key, value);
  });
}

export function persistAuthSession(authData = {}) {
  if (typeof window === "undefined") return;

  const userType = authData.userType ?? authData.user_Type ?? "";
  const role = authData.role || getRoleFromUserType(userType) || "";

  const payload = {
    accessToken: authData.accessToken ?? "",
    refreshToken: authData.refreshToken ?? "",
    empId: String(authData.empId ?? ""),
    userType: String(userType ?? ""),
    employeeName: authData.employeeName ?? authData.employee_Name ?? "",
    email: authData.email ?? authData.emailId ?? "",
    auth: authData.auth ?? "true",
    role,
    designation: authData.designation ?? "",
  };

  Object.entries(payload).forEach(([key, value]) => {
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  });
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  AUTH_SESSION_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}
