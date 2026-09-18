"use client";

import {
  Bell,
  ChevronDown,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { api } from "@/lib/api";

import { useTheme } from "../context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTaskNotifications,
  markNotificationRead,
} from "@/store/slices/timesheetSlice";

export default function Navbar({ onMenuClick }) {
  const { isDark, toggle, t } = useTheme();
  const pathname = usePathname();
  console.log("CURRENT NAVBAR PATHNAME:", pathname);

  const dispatch = useDispatch();

  const [empName, setEmpName] = useState("");
  const [designation, setDesignation] = useState("");
  const [empId, setEmpId] = useState("");

  const [showNotifications, setShowNotifications] =
    useState(false);
    const notificationRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

    const handleLogout = () => {
  sessionStorage.clear();

  router.push("/login");
};

const {
  notifications = [],
  notificationsLoading = false,
} = useSelector((state) => state.timesheet || {});

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    const storedEmpName =
  sessionStorage.getItem("employeeName") || "";

    const storedDesignation =
      sessionStorage.getItem("designation") || "";

    const storedEmpId =
      sessionStorage.getItem("empId") || "";

       console.log("================================");
  console.log("NAVBAR EMP ID:", storedEmpId);
  console.log("================================");

    setEmpName(storedEmpName);
    setDesignation(storedDesignation);
    setEmpId(storedEmpId);

    console.log("NAVBAR EMP ID:", storedEmpId);
  }, []);

  // =====================================================
  // GET NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    if (!empId) return;

    dispatch(
      fetchTaskNotifications({
        recipientId: Number(empId),
        unreadOnly: false,
      })
    );
  }, [dispatch, empId]);

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const isNotificationRead = (notification) => {
  return (
    notification.is_Read === true ||
    notification.is_Read === 1 ||
    notification.is_Read === "true"
  );
};

const unreadCount = notifications.filter(
  (notification) =>
    !isNotificationRead(notification)
).length;

  // =====================================================
  // MARK NOTIFICATION AS READ
  // =====================================================

  const handleNotificationClick = (notification) => {
  console.log(
    "NOTIFICATION CLICKED:",
    notification
  );



  // 1. Mark notification as read
  if (!isNotificationRead(notification)) {
    dispatch(
      markNotificationRead(
        notification.notification_Id
      )
    );
  }

  // 2. Close notification dropdown
  setShowNotifications(false);

  // 3. Open the task
  router.push(
  `/tasks?taskId=${notification.task_Id}`
);
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setShowProfile(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showNotifications, showProfile]);

  // =====================================================
  // INITIALS
  // =====================================================

  function getInitials(name) {
    const parts = name.trim().split(" ");

    return (
      (parts[0]?.[0] ?? "") +
      (parts[1]?.[0] ?? "")
    ).toUpperCase();
  }

  // =====================================================
  // PAGE TITLES
  // =====================================================

  const pageTitles = {
    "/employee": "Employee Details",
    "/timesheet": "Task Time Sheet",
    "/finance": "Finance Dashboard",
    "/finance/clients": "Clients",
    "/finance/clients/new": "Clients",
    "/project": "Projects",
    "/tasks/create": "Add Task",
    "/clients": "Clients",
    "/settings": "Settings",
    "/calendar": "Calendar",
    "/tasks": "Tasks",
    "/tasks/template-tasks": "Template Tasks",
    "/reports/resource-allocation": "Resource Allocation",
    "/it/tickets": "IT Tickets",
    "/it/claim-assets": "Claim Assets",
    "/reports/summary-report": "Summary Report",
    "/reports/daily-report": "Daily Report",
    "/reports/weekly-report": "Weekly Report",
    "/reports/week-utilization": "Week Utilization",
    "/finance/project-lists": "Project Lists",
    "/finance/rate-cards": "Rate Cards",
    "/finance/rate-cards/buying-center": "Buying Center",
  };

  let pageTitle = "Dashboard";
  let pageSubtitle = "Medtrix Project Management";

  if (pageTitles[pathname]) {
    pageTitle = pageTitles[pathname];
  }

  if (pathname.startsWith("/employee/")) {
    pageTitle = "Employee Details";
  }

  if (pathname.startsWith("/project/")) {
    pageTitle = "Project Details";
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex h-16 items-center justify-between px-6 gap-4">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`xl:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${t.iconBtn}`}
        >
          <Menu size={17} />
        </button>

        <div>
          <h1
            className={`text-xl font-semibold ${t.textPrimary}`}
          >
            {pageTitle}
          </h1>

          {pageSubtitle && (
            <p
              className={`text-xs ${t.textMuted}`}
            >
              {pageSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">

        {/* Theme
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${t.iconBtn}`}
        >
          {isDark ? (
            <Sun size={15} />
          ) : (
            <Moon size={15} />
          )}
        </button> */}

        {/* ================================================= */}
        {/* NOTIFICATION BELL */}
        {/* ================================================= */}

        <div ref={notificationRef} className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                (prev) => !prev
              )
            }
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${t.iconBtn}`}
          >
            <Bell size={15} />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* ================================================= */}
          {/* NOTIFICATION DROPDOWN */}
          {/* ================================================= */}

          {showNotifications && (
            <div
              className={`absolute right-0 top-10 z-50 w-[360px] overflow-hidden rounded-xl border shadow-xl ${
                isDark
                  ? "border-white/10 bg-[#1f1f1f]"
                  : "border-gray-200 bg-white"
              }`}
            >

              {/* Header */}
              <div
                className={`flex items-center justify-between border-b px-4 py-3 ${
                  isDark
                    ? "border-white/10"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      t.textPrimary
                    }`}
                  >
                    Notifications
                  </h3>

                  <p
                    className={`text-xs ${t.textMuted}`}
                  >
                    {unreadCount} unread
                  </p>
                </div>

                <Bell
                  size={16}
                  className="text-red-500"
                />
              </div>

              {/* Body */}
              <div className="max-h-[400px] overflow-y-auto">

                {notificationsLoading ? (
                  <div
                    className={`px-4 py-8 text-center text-sm ${t.textMuted}`}
                  >
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div
                    className={`px-4 py-8 text-center text-sm ${t.textMuted}`}
                  >
                    No notifications
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <button
                        key={
                          notification.notification_Id
                        }
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`w-full border-b px-4 py-3 text-left transition-colors ${
                          isDark
                            ? "border-white/10 hover:bg-white/5"
                            : "border-gray-100 hover:bg-gray-50"
                        } ${
                          !notification.is_Read
                            ? isDark
                              ? "bg-red-500/5"
                              : "bg-red-50/40"
                            : ""
                        }`}
                      >

                        <div className="flex gap-3">

                          {/* Status */}
                          <div className="pt-1">
                            <span
                              className={`block h-2 w-2 rounded-full ${
                                notification.is_Read
                                  ? "bg-gray-300"
                                  : "bg-red-500"
                              }`}
                            />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <p
                                className={`text-sm font-semibold ${t.textPrimary}`}
                              >
                                {
                                  notification.notification_Title
                                }
                              </p>

                              {!notification.is_Read && (
                                <span className="shrink-0 text-[9px] font-semibold uppercase text-red-500">
                                  New
                                </span>
                              )}
                            </div>

                            <p
                              className={`mt-1 text-xs ${t.textSecondary}`}
                            >
                              {
                                notification.notification_Message
                              }
                            </p>

                            <div className="mt-2 flex items-center gap-2">

                              <span
                                className={`text-[10px] ${t.textMuted}`}
                              >
                                Task #
                                {
                                  notification.task_Id
                                }
                              </span>

                              <span
                                className={`text-[10px] ${t.textMuted}`}
                              >
                                •
                              </span>

                              <span
                                className={`text-[10px] ${t.textMuted}`}
                              >
                                {
                                  notification.notification_Type
                                }
                              </span>

                            </div>

                          </div>
                        </div>

                      </button>
                    )
                  )
                )}

              </div>
            </div>
          )}

        </div>

        {/* Divider */}
        <div
          className={`mx-2 h-5 w-px ${t.divider}`}
        />

{/* USER PROFILE */}
{/* ================================================= */}

<div ref={profileRef} className="relative">
  <button
    type="button"
    onClick={() => setShowProfile((prev) => !prev)}
    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${t.userHover}`}
  >
    {/* Profile Circle */}
    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
      {getInitials(empName)}
    </span>

    {/* User Name / Designation */}
    <div className="hidden sm:flex flex-col items-start">
      <span
        className={`text-xs font-semibold leading-tight font-mono ${t.textPrimary}`}
      >
        {empName}
      </span>

      <span
        className={`text-[10px] leading-tight ${t.textMuted}`}
      >
        {designation}
      </span>
    </div>

    <ChevronDown
      size={12}
      className={`hidden sm:block transition-transform ${t.textMuted} ${
        showProfile ? "rotate-180" : ""
      }`}
    />
  </button>

  {/* ================================================= */}
  {/* PROFILE DROPDOWN */}
  {/* ================================================= */}

  {showProfile && (
    <div
      className={`absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border shadow-xl ${
        isDark
          ? "border-white/10 bg-[#1f1f1f]"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* User Information */}
      <div
        className={`border-b px-4 py-3 ${
          isDark
            ? "border-white/10"
            : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {getInitials(empName)}
          </span>

          <div className="min-w-0">
            <p
              className={`truncate text-sm font-semibold ${t.textPrimary}`}
            >
              {empName || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className={`flex w-full items-center px-4 py-3 text-sm font-medium transition-colors ${
          isDark
            ? "text-gray-300 hover:bg-red-500/10 hover:text-red-400"
            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        Logout
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
}