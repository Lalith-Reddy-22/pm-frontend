"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  AVATAR_STYLES,
  parseMDY,
} from "./data";
import EmployeeToolbar from "./components/EmployeeToolbar";
import { getEmployeeList } from "@/services/employeeService";
import AddEmployeeDrawer from "./components/AddEmployeeDrawer";
import {
  COLUMNS,
  PAGE_SIZE_OPTIONS,
} from "./constants";
import EmployeeTable from "./components/EmployeeTable";
import { useDispatch } from "react-redux";
import { exportFile } from "@/store/slices/exportSlice";
import { format } from "date-fns";
import EditEmployeeModal from "./components/EditEmployeeModal";

// Mock data


export default function EmployeePage() {
  const dispatch = useDispatch();

  useEffect(() => {
  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const employees = await getEmployeeList();
      setData(employees);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  loadEmployees();
}, []);
  const { t, isDark } = useTheme();

  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

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

  const handleEmployeeExport = async (exportFormat = "csv") => {
  try {
    const exportData = sorted.map((employee) => ({
      name: employee.name ?? "",
      email: employee.email ?? "",
      designation: employee.designation ?? "",
      team: employee.team ?? "",
      createdDate: employee.createdDate ?? "",
    }));

    await dispatch(
      exportFile({
        fileName: `employee-list-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          { key: "name", header: "Employee Name" },
          { key: "email", header: "Email" },
          { key: "designation", header: "Designation" },
          { key: "team", header: "Team" },
          { key: "createdDate", header: "Created Date" },
        ],
        data: exportData,
      })
    ).unwrap();
  } catch (error) {
    console.error("EMPLOYEE EXPORT ERROR:", error);
  }
};

const handleEmployeeSelectedPages = async (
  exportFormat,
  fromPage,
  toPage
) => {
  try {
    const selectedRows = [];

    for (
      let pageNumber = fromPage;
      pageNumber <= toPage;
      pageNumber++
    ) {
      const start = (pageNumber - 1) * pageSize;
      const end = pageNumber * pageSize;

      selectedRows.push(...sorted.slice(start, end));
    }

    const exportData = selectedRows.map((employee) => ({
      name: employee.name ?? "",
      email: employee.email ?? "",
      designation: employee.designation ?? "",
      team: employee.team ?? "",
      createdDate: employee.createdDate ?? "",
    }));

    await dispatch(
      exportFile({
        fileName: `employee-list-pages-${fromPage}-to-${toPage}-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          { key: "name", header: "Employee Name" },
          { key: "email", header: "Email" },
          { key: "designation", header: "Designation" },
          { key: "team", header: "Team" },
          { key: "createdDate", header: "Created Date" },
        ],
        data: exportData,
      })
    ).unwrap();
  } catch (error) {
    console.error(
      "EMPLOYEE SELECTED PAGE EXPORT ERROR:",
      error
    );
  }
};

  const [showEditModal, setShowEditModal] = useState(false);

const [selectedEmployee, setSelectedEmployee] = useState(null);

if (loading) {
  return (
    <div className="p-6">
      Loading employees...
    </div>
  );
}

if (error) {
  return (
    <div className="p-6 text-red-500">
      {error}
    </div>
  );
}

  return (
    <>
      <div className="space-y-4 p-4 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <EmployeeToolbar
  search={search}
  setSearch={setSearch}
  pageSize={pageSize}
  setPageSize={setPageSize}
  setPage={setPage}
  onExport={handleEmployeeExport}
  handleSelectedPages={handleEmployeeSelectedPages}
  totalPages={totalPages}
  setShowDrawer={setShowDrawer}
/>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
            setPage={setPage}
            COLUMNS={COLUMNS}
            sort={sort}
            toggleSort={toggleSort}
          />
        </div>
      </div>

      <AddEmployeeDrawer showDrawer={showDrawer} setShowDrawer={setShowDrawer} />
    </>
  );
}
