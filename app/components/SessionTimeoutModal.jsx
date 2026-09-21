"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

const AUTH_KEYS = [
  "accessToken", "refreshToken", "empId",
  "userType", "employeeName", "email", "auth", "role",
];

function clearSession() {
  AUTH_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

export default function SessionTimeoutModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleTimeout() {
      setVisible(true);
      // Push a dummy history entry so the back button has somewhere to "go"
      // without actually leaving the current page.
      window.history.pushState(null, "", window.location.href);
    }

    window.addEventListener("session:timeout", handleTimeout);
    return () => window.removeEventListener("session:timeout", handleTimeout);
  }, []);

  // While the modal is visible, intercept the browser back/forward button
  // and redirect to login instead of going to the previous page.
  useEffect(() => {
    if (!visible) return;

    function handlePopState() {
      // Push state again to prevent the navigation from completing
      window.history.pushState(null, "", window.location.href);
      // Then send them to login
      clearSession();
      setVisible(false);
      router.replace("/login");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [visible, router]);

  function handleLogin() {
    clearSession();
    setVisible(false);
    router.replace("/login");
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-4 bg-white dark:bg-[#1a1a1a]"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10">
          <Clock size={30} className="text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Session Timed Out
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Your session has expired due to inactivity. Please log in again to continue.
          </p>
        </div>

        {/* Action */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(90deg, #e53935 0%, #c2185b 100%)",
            boxShadow: "0 4px 16px rgba(220,50,80,0.35)",
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
