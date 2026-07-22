"use client";

import { Bell, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { usePathname } from "next/navigation";

export default function Navbar({ onMenuClick }) {
  const { isDark, toggle, t } = useTheme();
  const pathname = usePathname();
  const pageTitles = {
  "/dashboard": "Dashboard",
  "/employee": "Employee Details",
  "/timesheet": "Task Time Sheet",
  "/finance": "Finance Dashboard",
  "/finance/clients": "Clients",
  "/finance/clients/new": "Clients",
  "/projects": "Projects",
  "/settings": "Settings",
  "/calendar": "Calendar",
  "/tasks": "Tasks",
  "/tasks/template-tasks": "Template Tasks",
  "/reports/resource-allocation": "Resource Allocation"
};

let pageTitle = "Dashboard";
let pageSubtitle = "Medtrix Project Management";

// Exact match
if (pageTitles[pathname]) {
  pageTitle = pageTitles[pathname];
}


// Dynamic pages
if (pathname.startsWith("/employee/")) {
  pageTitle = "Employee Details";
}

if (pathname.startsWith("/project/")) {
  pageTitle = "Project Details";
}

  return (
    <div className="flex h-16 items-center justify-between px-6 gap-4">

      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className={`xl:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${t.iconBtn}`}
        >
          <Menu size={17} />
        </button>

        <div>
           <h1 className={`text-xl font-semibold ${t.textPrimary}`}>
            {pageTitle}
            </h1>  
            {pageSubtitle && (
            <p className={`text-xs ${t.textMuted}`}>
            {pageSubtitle}
            </p>
            )}
            </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">


        {/* Theme */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${t.iconBtn}`}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Bell */}
        <button className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${t.iconBtn}`}>
          <Bell size={15} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className={`mx-2 h-5 w-px ${t.divider}`} />

        {/* User */}
        <button className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${t.userHover}`}>
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
            AS
          </span>
          <div className="hidden sm:flex flex-col items-start">
            <span className={`text-xs font-semibold leading-tight font-mono ${t.textPrimary}`}>Andrew Smith</span>
            <span className={`text-[10px] leading-tight ${t.textMuted}`}>Admin</span>
          </div>
          <ChevronDown size={12} className={`hidden sm:block ${t.textMuted}`} />
        </button>

      </div>
    </div>
  );
}
