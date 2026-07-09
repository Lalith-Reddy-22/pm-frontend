"use client";

import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  EMPLOYEES,
  AVATAR_STYLES,
  parseMDY,
} from "./data";
import EmployeeToolbar from "./components/EmployeeToolbar";
import AddEmployeeDrawer from "./components/AddEmployeeDrawer";
import {
  handleCopy,
  handleCSV,
  handlePrint,
  handlePDF,
} from "./utils";
import {
  COLUMNS,
  PAGE_SIZE_OPTIONS,
} from "./constants";
import EmployeeTable from "./components/EmployeeTable";
import EditEmployeeModal from "./components/EditEmployeeModal";

// Mock data


export default function EmployeePage() {
  const { t, isDark } = useTheme();

  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [data] = useState(EMPLOYEES);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const border = isDark ? "border-white/10" : "border-gray-200";
  const headerBg = isDark ? "bg-white/[0.04]" : "bg-gray-50";
  const inputBg = isDark ? "bg-white/5" : "bg-white";
  const avatar = isDark ? AVATAR_STYLES.dark : AVATAR_STYLES.light;

  function toggleSort(key) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q) ||
        emp.team.toLowerCase().includes(q)
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    const { key, dir } = sort;
    const mul = dir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      if (key === "createdDate") return (parseMDY(a.createdDate) - parseMDY(b.createdDate)) * mul;
      return a[key].localeCompare(b[key]) * mul;
    });
    return rows;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  const [showEditModal, setShowEditModal] = useState(false);

const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <>
    <div className="p-6">
      <div className={`rounded-2xl  ${t.cardBg} ${t.cardShadow} overflow-hidden`}>

        {/* <div className={`px-6 py-5 border-b ${border}`}>
          <h1 className={`text-xl font-semibold ${t.textPrimary}`}>Employee Details</h1>
        </div> */}
<EmployeeToolbar
  search={search}
  setSearch={setSearch}
  pageSize={pageSize}
  setPageSize={setPageSize}
  setPage={setPage}
  border={border}
  inputBg={inputBg}
  t={t}
  isDark={isDark}
  showExport={showExport}
  setShowExport={setShowExport}

  handleCopy={() => handleCopy(sorted)}
  handleCSV={() => handleCSV(sorted)}
  handlePrint={() => handlePrint(sorted)}
  handlePDF={() => handlePDF(sorted)}

  setShowDrawer={setShowDrawer}
/>

<EmployeeTable
  pageRows={pageRows}
  border={border}
  headerBg={headerBg}
  t={t}
  isDark={isDark}
  avatar={avatar}
  filtered={sorted}
  clampedPage={clampedPage}
  pageSize={pageSize}
  totalPages={totalPages}
  setShowEditModal={setShowEditModal}
  setSelectedEmployee={setSelectedEmployee}
  setPage={setPage}
  COLUMNS={COLUMNS}
  sort={sort}
  toggleSort={toggleSort}
/>

<EditEmployeeModal
  showEditModal={showEditModal}
  setShowEditModal={setShowEditModal}
  employee={selectedEmployee}
/>
      </div>
    </div>
    
<AddEmployeeDrawer
  showDrawer={showDrawer}
  setShowDrawer={setShowDrawer}
/>
  </>
  );
}
