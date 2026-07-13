"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function LayoutInner({ children }) {
  const { t, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);  // mobile overlay
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);  // desktop collapse

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${t.pageBg} transition-colors duration-300`}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Floating collapse button ── */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ top: "18px" }}
          className={`
            hidden xl:flex fixed left-0 z-40
            h-7 w-7 rounded-full shadow-md items-center justify-center
            transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? "translate-x-[46px]" : "translate-x-[246px]"}
            ${isDark
              ? "bg-[#1f2433] text-gray-400 border border-white/10 hover:text-gray-200"
              : "bg-white text-gray-500 border border-gray-200 hover:text-gray-900"}
          `}
        >
          {sidebarCollapsed
            ? <ChevronRight size={13} strokeWidth={2.5} />
            : <ChevronLeft size={13} strokeWidth={2.5} />
          }
        </button>
      )}

      {/* Sidebar — desktop, width animates */}
      <aside
        className={`
          hidden xl:flex flex-col flex-shrink-0 h-full
          ${t.sidebarBg} ${t.sidebarBorder}
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "w-[60px] overflow-visible" : "w-[260px] overflow-hidden"}
        `}
      >
        <Sidebar collapsed={sidebarCollapsed} />
      </aside>

      {/* Sidebar — mobile overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 flex flex-col w-[260px]
        ${t.sidebarBg} ${t.sidebarBorder}
        transform transition-transform duration-300 ease-in-out
        xl:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Right column */}
      <div className="grid grid-rows-[auto_1fr] gap-1 w-full overflow-hidden">

        <div className={`flex-shrink-0 ${t.navbarBg} ${t.navbarBorder} transition-colors duration-300`}>
          <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
        </div>

        <main className={`flex-1 overflow-y-auto ${t.mainBg} transition-colors duration-300`}>
          {children}
        </main>

      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider>
      <LayoutInner>{children}</LayoutInner>
    </ThemeProvider>
  );
}
