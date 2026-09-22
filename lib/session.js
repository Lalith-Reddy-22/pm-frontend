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

  const payload = {
    accessToken: authData.accessToken ?? "",
    refreshToken: authData.refreshToken ?? "",
    empId: String(authData.empId ?? ""),
    userType: String(authData.userType ?? ""),
    employeeName: authData.employeeName ?? "",
    email: authData.email ?? "",
    auth: authData.auth ?? "true",
    role: authData.role ?? "",
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
