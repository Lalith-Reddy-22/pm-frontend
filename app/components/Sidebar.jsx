"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2, FileText, PieChart, Users,
  CheckSquare, Layout, Ticket, Package,
  Calendar, Briefcase, UserCheck, Clock,
  DollarSign, FolderOpen, List, CreditCard,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// ── Menu config ──────────────────────────────────────────────────────────────

const ALL_NAV_ITEMS = [
  {
    id: "reports", label: "Reports", icon: BarChart2,
    roles: ["admin", "employee", "sys_admin", "pm_employee"],
    children: [
      { id: "daily-report",        href: "/reports/daily-report",        label: "Daily Report",                icon: FileText,  roles: ["admin", "pm_employee"]                          },
      { id: "week-utilization",    href: "/reports/week-utilization",    label: "Week Utilization",            icon: PieChart,  roles: ["admin", "pm_employee"]                          },
      { id: "summary-report",      href: "/reports/summary-report",      label: "Summary Report",              icon: BarChart2, roles: ["admin", "pm_employee"]                          },
      { id: "resource-allocation", href: "/reports/resource-allocation", label: "Resource Allocation Reports", icon: Users,     roles: ["admin", "employee", "sys_admin", "pm_employee"] },
    ],
  },
  {
    id: "tasks", label: "Tasks Section", icon: CheckSquare,
    roles: ["admin", "pm_employee"],
    children: [
      { id: "tasks",          href: "/tasks",                label: "Tasks",          icon: CheckSquare, roles: ["admin", "pm_employee"] },
      { id: "template-tasks", href: "/tasks/template-tasks", label: "Template Tasks", icon: Layout,      roles: ["admin", "pm_employee"] },
    ],
  },
  {
    id: "it", label: "IT Section", icon: Ticket,
    roles: ["admin", "employee", "sys_admin", "pm_employee"],
    children: [
      { id: "tickets",      href: "/it/tickets",      label: "Tickets",      icon: Ticket,  roles: ["admin", "employee", "sys_admin", "pm_employee"] },
      { id: "claim-assets", href: "/it/claim-assets", label: "Claim Assets", icon: Package, roles: ["admin", "employee", "sys_admin", "pm_employee"] },
    ],
  },
  { id: "calendar",  href: "/calendar",  label: "Calendar View", icon: Calendar,   roles: ["admin", "employee", "sys_admin", "pm_employee"] },
  { id: "clients",   href: "/clients",   label: "Clients",       icon: Briefcase,  roles: ["admin", "pm_employee"] },
  { id: "project",   href: "/project",   label: "Project",       icon: FolderOpen, roles: ["admin", "pm_employee"] },
  { id: "employee",  href: "/employee",  label: "Employee",      icon: UserCheck,  roles: ["admin", "pm_employee"] },
  { id: "timesheet", href: "/timesheet", label: "Time Sheet",    icon: Clock,      roles: ["admin", "employee", "sys_admin", "pm_employee"] },
  {
    id: "finance", label: "Finance Module", icon: DollarSign,
    roles: ["admin"],
    children: [
      { id: "finance-clients", href: "/finance/clients",       label: "Clients",       icon: Briefcase,  roles: ["admin"] },
      { id: "project-lists",   href: "/finance/project-lists", label: "Project Lists", icon: List,       roles: ["admin"] },
      { id: "rate-cards",      href: "/finance/rate-cards",    label: "Rate Cards",    icon: CreditCard, roles: ["admin"] },
    ],
  },
];

function getNavItems(role) {
  return ALL_NAV_ITEMS
    .filter(item => item.roles.includes(role))
    .map(item => ({
      ...item,
      children: item.children?.filter(c => c.roles.includes(role)),
    }));
}

function computeOpenGroups(pathname, items) {
  const open = {};
  for (const item of items) {
    if (item.children?.some(c => pathname.startsWith(c.href))) {
      open[item.id] = true;
    }
  }
  return open;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar({ onClose, collapsed = false }) {
  const pathname = usePathname();
  const { t, isDark } = useTheme();

  // role is read client-side only (sessionStorage unavailable on server)
  const [role, setRole] = useState("admin");
  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
    const r = sessionStorage.getItem("role") || "admin";
    setRole(r);
    setOpenGroups(computeOpenGroups(pathname, getNavItems(r)));
  }, []);

  const navItems = getNavItems(role);

  function toggleGroup(id) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function isActive(href) {
    if (href === "/tasks") return pathname === "/tasks";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function isGroupActive(item) {
    if (item.href) return isActive(item.href);
    return item.children ? item.children.some(c => isActive(c.href)) : false;
  }

  function handleNavClose() {
    if (onClose) onClose();
  }

  const linkClass = (href, extra = "") =>
    `w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 ${extra}
     ${isActive(href) ? t.navRowActive : `${t.navLabel} ${t.navRowHover}`}`;

  return (
    <div className={`relative flex flex-col h-full w-full ${t.sidebarBg} transition-colors duration-300`}>

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className={`flex items-center h-16 flex-shrink-0 ${t.navbarBorder} transition-colors duration-300
        ${collapsed ? "justify-center px-3" : "gap-3 px-4"}
      `}>
        <Link href="/" onClick={handleNavClose}>
          <img src="/logo.png" alt="logo" className="h-8 w-auto object-contain flex-shrink-0" />
        </Link>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold leading-tight truncate ${t.brandName}`}>medtrix</p>
            <p className={`text-[10px] uppercase tracking-widest leading-tight truncate ${t.tagline}`}>
              Catalyzing Healthcare
            </p>
          </div>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className={`sidebar-scroll flex-1 py-3 px-2 flex flex-col gap-px
        ${collapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"}
      `}>
        {navItems.map(item => {
          const Icon      = item.icon;
          const hasKids   = !!item.children?.length;
          const grpActive = isGroupActive(item);
          const isOpen    = openGroups[item.id] ?? false;
          const iconCls   = `flex-shrink-0 transition-colors duration-150
            ${grpActive ? (isDark ? "text-red-400" : "text-red-600") : t.iconColor}`;

          return (
            <div key={item.id} className={collapsed && hasKids ? "relative group/flyout" : ""}>

              {/* ── Leaf item (no children) ──────────────────────────────── */}
              {!hasKids && (
                <Link
                  href={item.href}
                  onClick={handleNavClose}
                  title={collapsed ? item.label : undefined}
                  className={linkClass(item.href, collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2")}
                >
                  <Icon size={16} className={iconCls} />
                  {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                </Link>
              )}

              {/* ── Group (has children) ─────────────────────────────────── */}
              {hasKids && (
                <button
                  onClick={() => { if (!collapsed) toggleGroup(item.id); }}
                  className={`
                    w-full flex items-center gap-3 rounded-lg text-sm font-medium
                    transition-all duration-150
                    ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"}
                    ${grpActive ? t.navRowActive : `${t.navLabel} ${t.navRowHover}`}
                  `}
                >
                  <Icon size={16} className={iconCls} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown
                        size={13}
                        className={`flex-shrink-0 transition-transform duration-200 ${t.chevron}
                          ${isOpen ? "rotate-0" : "-rotate-90"}`}
                      />
                    </>
                  )}
                </button>
              )}

              {/* ── Flyout (collapsed + has children) ───────────────────── */}
              {collapsed && hasKids && (
                <div className="pointer-events-none opacity-0 group-hover/flyout:pointer-events-auto group-hover/flyout:opacity-100 absolute left-full top-0 z-[100] transition-all duration-150">
                  <div className="w-3 h-full absolute right-full top-0" />
                  <div className={`ml-1 min-w-[210px] rounded-xl py-2 shadow-xl
                    ${isDark ? "bg-[#1a1a1a] border border-white/10" : "bg-white border border-gray-100"}`}
                  >
                    <p className={`px-3 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-widest ${t.tagline}`}>
                      {item.label}
                    </p>
                    {item.children.map(child => {
                      const ChildIcon = child.icon;
                      const active    = isActive(child.href);
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          onClick={handleNavClose}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150
                            ${active ? t.subActive : t.subInactive}`}
                        >
                          <ChildIcon size={13} className={`flex-shrink-0 ${active ? (isDark ? "text-red-400" : "text-red-500") : t.iconColor}`} />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Accordion (expanded + has children) ─────────────────── */}
              {hasKids && !collapsed && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className={`ml-4 mt-0.5 pl-3 flex flex-col gap-px border-l-2
                    ${isDark ? "border-white/10" : "border-gray-200"}`}
                  >
                    {item.children.map(child => {
                      const ChildIcon = child.icon;
                      const active    = isActive(child.href);
                      return (
                        <Link
                          key={child.id}
                          href={child.href}
                          onClick={handleNavClose}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150
                            ${active ? t.subActive : t.subInactive}`}
                        >
                          <ChildIcon size={13} className={`flex-shrink-0 ${active ? (isDark ? "text-red-400" : "text-red-500") : t.iconColor}`} />
                          <span className="truncate">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </nav>

      {/* ── Logout ───────────────────────────────────────────────────────── */}
      {/* <div className={`px-2 py-3 flex-shrink-0 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
        <button
          onClick={handleLogout}
          title={collapsed ? "Log out" : undefined}
          className={`group w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 ${t.logoutBase}
            ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"}`}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div> */}

    </div>
  );
}
