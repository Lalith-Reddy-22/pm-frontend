"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getEmployeeById,
  getProjectVisuals,
} from "../data";
import { ArrowLeft } from "lucide-react";
// import EmployeePagination from "./components/EmployeePagination";
import { useTheme } from "../../../context/ThemeContext";
import EmployeeInfoCard from "./components/EmployeeInfoCard";
import EditEmployeeModal from "./components/EditEmployeeModal";
import EmployeeProjectsTable from "./components/EmployeeProjects";
import EmployeeHeader from "./components/EmployeeHeader";


export default function EmployeeDetailPage() {
  const { t, isDark } = useTheme();
  const { id } = useParams();
  const employee = getEmployeeById(id);

  const border = isDark ? "border-white/10" : "border-gray-200";

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    if (!employee?.projects) return [];
    return employee.projects.map((proj) => ({ proj, visuals: getProjectVisuals(proj) }));
  }, [employee]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      ({ proj, visuals }) =>
        proj.name.toLowerCase().includes(q) || visuals.client.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const totalEntries = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = totalEntries === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, totalEntries);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const totalTasks = rows.reduce((sum, r) => sum + r.visuals.tasksTotal, 0);
  const totalProjects = employee?.projects?.length ?? 0;
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEmployeeUpdate = (updatedEmployee) => {
  console.log("Updated Employee:", updatedEmployee);

  // Later, call your API here

  setShowEditModal(false);
};

  if (!employee) {
    return (
      <div className="p-6">
        <div className={`rounded-2xl border ${border} ${t.cardBg} ${t.cardShadow} p-10 text-center`}>
          <p className={`text-sm font-medium ${t.textPrimary}`}>Employee not found</p>
          <p className={`mt-1 text-sm ${t.textMuted}`}>
            No employee matches “{id}”. They may have been removed, or the link is incorrect.
          </p>
          <Link
            href="/employee"
            className={`mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors
              ${isDark ? "bg-gray-100 text-gray-900 hover:bg-white" : "bg-gray-900 hover:bg-black"}`}
          >
            <ArrowLeft size={14} />
            Back to Employee Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
        {/* ── Profile card ─────────────────────────────────────────── */}
<EmployeeInfoCard
  employee={employee}
  totalTasks={totalTasks}
  totalProjects={totalProjects}
  t={t}
  isDark={isDark}
  border={border}
  onEdit={() => setShowEditModal(true)}
/>
        {/* ── Projects table ───────────────────────────────────────── */}
        <div className={`rounded-2xl border ${border} ${t.cardBg} ${t.cardShadow} overflow-hidden`}>
    <EmployeeHeader
    pageSize={pageSize}
    setPageSize={setPageSize}
    search={search}
    setSearch={setSearch}
    setPage={setPage}
    border={border}
    isDark={isDark}
    t={t}
/>      
<EmployeeProjectsTable
    pageRows={pageRows}
    border={border}
    isDark={isDark}
    t={t}
/>
{/* <EmployeePagination
  totalEntries={totalEntries}
  startIdx={startIdx}
  endIdx={endIdx}
  safePage={safePage}
  totalPages={totalPages}
  setPage={setPage}
  border={border}
  isDark={isDark}
  t={t}
/>    */}
        </div>
      </div>
      <EditEmployeeModal
  open={showEditModal}
  employee={employee}
  onClose={() => setShowEditModal(false)}
  onUpdate={handleEmployeeUpdate}
/>

    </div>
  );
}
