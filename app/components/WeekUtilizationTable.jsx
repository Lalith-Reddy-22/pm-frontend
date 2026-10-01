"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import WeekRangePicker from "./WeekRangePicker";
import { useTheme } from "../context/ThemeContext";
import EmployeeTaskDetailsModal from "./EmployeeTaskDetailsModal";
import Pagination from "./pagination";
import { usePagination } from "../../hooks/usePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Info } from "lucide-react";

import {
  fetchResourceAllocation,
  fetchTaskDetails,
} from "@/store/slices/resourceAllocationSlice";

const today = new Date();

const DEFAULT_START = startOfWeek(today, {
  weekStartsOn: 1,
});

const DEFAULT_END = endOfWeek(today, {
  weekStartsOn: 1,
});


// Parse date string to ISO key YYYY-MM-DD (handles both MM/DD/YYYY and YYYY-MM-DD)
function parseDateKey(dateString) {
  if (!dateString) return "";

  if (dateString.includes("-")) {
    return dateString;
  }

  const [month, day, year] = dateString.split("/");

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function fmtApiDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Transform backend response into the internal row format
function transformApiData(employees, dept) {
  if (!Array.isArray(employees)) {
    return [];
  }

  return employees.map((emp) => {
    const dailyData = {};

    if (Array.isArray(emp.dates)) {
      emp.dates.forEach(({ date, planned, logged, available }) => {
        const key = parseDateKey(date);

        if (planned === 0 && logged === 0 && available === 0) {
          dailyData[key] = {
            type: "dot",
          };
        } else if (planned === 0 && logged === 0) {
          dailyData[key] = {
            type: "available",
            available: Number(available ?? 0),
          };
        } else {
          dailyData[key] = {
            type: "data",
            p: Number(planned ?? 0),
            a: Number(available ?? 0),
            l: Number(logged ?? 0),
          };
        }
      });
    }

    const totalPlanned = Number(emp.total_planned ?? 0);
const totalLogged = Number(emp.total_logged ?? 0);

const utilization =
  totalPlanned > 0
    ? Math.round((totalLogged / totalPlanned) * 100)
    : 0;

return {
  id: emp.empId,
  name: emp.employee_Name || "Unknown",
  dept,
  dailyData,

  total_planned: totalPlanned,
  total_logged: totalLogged,

  // Logged Hours / Planned Hours * 100
  utilization,
};
  });
}

function getDatesInRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function fmtColDate(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DayCell({
  entry,
  isDark,
  t,
  onCellClick,
}) {
  if (!entry) return <td className={`px-4 py-3 text-center align-middle ${t.textMuted}`}>—</td>;

  if (entry.type === "available") {
  return (
    <td className="px-4 py-3 text-center align-middle">
      <div
  onClick={onCellClick}
  className="flex cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-red-50"
>
        <span className={`font-medium ${t.textPrimary}`}>
          P:0
        </span>

        <span className={t.textMuted}>|</span>

        <span className="font-medium text-blue-500">
          A:{entry.available}
        </span>

        <span className={t.textMuted}>|</span>

        <span className={t.textMuted}>
          L:0
        </span>
      </div>
    </td>
  );
}

const { p, a, l } = entry;

const pPct = Math.min((p / 12) * 100, 100);

const barColor =
  p > 9
    ? "bg-red-500"
    : p === 9
      ? "bg-blue-400"
      : "bg-green-500";

  return (
    <td className="px-4 py-3 text-center align-middle">
      <div
  onClick={onCellClick}
  className="mb-1 flex cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-xs transition hover:bg-red-50 hover:text-red-600"
>
  <span className={`font-medium ${t.textPrimary}`}>P:{p}</span>

  <span className={t.textMuted}>|</span>

  <span className="font-medium text-blue-500">
    A:{a}
  </span>

  <span className={t.textMuted}>|</span>

  <span
    className={
      l > p && p > 0
        ? "font-medium text-red-500"
        : t.textMuted
    }
  >
    L:{l}
  </span>
</div>
      <div className="flex justify-center">
        <div
          className={`relative h-1.5 w-40 rounded-md overflow-hidden ${
            isDark ? "bg-white/10" : "bg-gray-200"
          }`}
        >
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${barColor}`}
            style={{ width: `${pPct}%` }}
          />
        </div>
      </div>
    </td>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  // return (
  //   <span className="inline-flex flex-col ml-1 opacity-50">
  //     <ChevronUp   size={10} className={sortCol === col && sortDir === "asc"  ? "opacity-100 text-red-500" : ""} />
  //     <ChevronDown size={10} className={sortCol === col && sortDir === "desc" ? "opacity-100 text-red-500" : ""} style={{ marginTop: -4 }} />
  //   </span>
  // );
}

// ── Main component ────────────────────────────────────────────────────────────

const TABS  = ["Content", "Editorial", "Creative", "Tech", "PM's", "AM's"];
const TAB_IDS = {
  Content: 3,
  Editorial: 9,
  Creative: 2,
  Tech: 1,
  "PM's": 4,
  "AM's": 8,
};
const PAGE_SIZE = 10;

export default function WeekUtilizationTable() {
  const { t, isDark } = useTheme();

  const [startDate, setStartDate] = useState(DEFAULT_START);
const [endDate, setEndDate] = useState(DEFAULT_END);
  const dispatch = useDispatch();

const {
  employees: apiData,
  loading,
  error,
  taskDetails,
  taskDetailsLoading,
} = useSelector((state) => state.resourceAllocation);
  const [activeTab,  setActiveTab]  = useState("Content");
  const [search,     setSearch]     = useState("");
  const [sortCol,    setSortCol]    = useState("name");
  const [sortDir,    setSortDir]    = useState("asc");

  const [taskPopupOpen, setTaskPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  

  const weekDays = useMemo(() => getDatesInRange(startDate, endDate), [startDate, endDate]);

  function handleTaskPopup(employee, date, entry, dateKey) {
  setSelectedEmployee(employee);
  setSelectedDate(date);
  setSelectedEntry(entry);

  // Open popup immediately
  setTaskPopupOpen(true);

  // Use exact table date for API
  const dateVal = dateKey;

  console.log("===== TASK DETAIL REQUEST =====");
  console.log("Employee ID:", employee.id);
  console.log("Clicked Date:", date);
  console.log("Date Key:", dateKey);
  console.log("API Date:", dateVal);
  console.log("================================");

  dispatch(
    fetchTaskDetails({
      empId: employee.id,
      dateVal,
    })
  );
}

async function handleTaskReassigned() {
  if (!selectedEmployee || !selectedDate) {
    return;
  }

  const dateVal = getLocalDateKey(selectedDate);

  console.log("Refreshing after reassignment...");
  console.log("Employee ID:", selectedEmployee.id);
  console.log("Date:", dateVal);

  // 1. Refresh Task Details popup
  await dispatch(
    fetchTaskDetails({
      empId: selectedEmployee.id,
      dateVal,
    })
  );

  // 2. Refresh Resource Allocation table
  // This updates P / A / L values
  await loadResourceAllocation();
}

  function handleRangeChange(s, e) { setStartDate(s); setEndDate(e); }

  const allData = useMemo(() => {
  if (!apiData.length) {
    return [];
  }

  return transformApiData(apiData, activeTab);
}, [apiData, activeTab]);

const filtered = useMemo(() => {
  let rows = [...allData];

  if (search.trim()) {
    rows = rows.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  rows.sort((a, b) => {
    const av = a.name.toLowerCase();
    const bv = b.name.toLowerCase();

    return sortDir === "asc"
      ? av.localeCompare(bv)
      : bv.localeCompare(av);
  });

  return rows;
}, [allData, search, sortDir]);

  const {
    paginatedData: pageRows,
    page, setPage,
    totalPages, totalItems,
    startIndex, endIndex,
    hasPrev, hasNext, prevPage, nextPage, pageNumbers,
  } = usePagination({ data: filtered, pageSize: PAGE_SIZE });

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  function handleTabChange(tab) { setActiveTab(tab); setPage(1); }
  function handleSearch(e)      { setSearch(e.target.value); setPage(1); }


  const card   = isDark ? "bg-[#111111] border border-white/5" : "bg-white border border-gray-200";
  const thCls  = `px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap
    ${isDark ? "text-gray-400 bg-[#1a1a1a]" : "text-gray-500 bg-gray-50"}`;
  const dateThCls = `px-4 py-3 min-w-[160px] text-center text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap ${
    isDark ? "text-gray-400 bg-[#1a1a1a]" : "text-gray-500 bg-gray-50"
  }`;
  const trCls  = `border-t transition-colors ${isDark ? "border-white/5 hover:bg-white/3" : "border-gray-100 hover:bg-gray-50"}`;

  useEffect(() => {
  loadResourceAllocation();
}, [startDate, endDate, activeTab]);

function loadResourceAllocation() {
  const teamId = TAB_IDS[activeTab];

  if (!teamId) {
    return;
  }

  dispatch(
    fetchResourceAllocation({
      startDate: fmtApiDate(startDate),
      endDate: fmtApiDate(endDate),
      teamId,
    })
  );
}

  return (
    <div className={`rounded-xl overflow-hidden flex flex-col min-h-[calc(100vh-6rem)] ${card}`}>

      {/* ── Top bar ── */}
      <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>

        {/* Left: date range */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${t.textSecondary}`}>Tasks Availability</span>
          <WeekRangePicker start={startDate} end={endDate} onChange={handleRangeChange} />
        </div>

        {/* Right: tabs */}
        <div className={`flex items-center rounded-full p-1 gap-1 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab
                  ? isDark ? "bg-white text-gray-900 shadow-sm" : "bg-gray-900 text-white shadow-sm"
                  : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div
        className={`px-6 py-3 flex items-center justify-end border-b ${
          isDark ? "border-white/5" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-sm ${t.textSecondary}`}>
            Search:
          </span>

          <input
            value={search}
            onChange={handleSearch}
            className={`w-44 px-3 py-1.5 rounded-lg text-sm border outline-none transition-colors
              ${
                isDark
                  ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-red-500/50"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-red-400"
              }`}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={`${thCls} w-52 sticky left-0 z-10`} onClick={() => toggleSort("name")}>
                NAME <SortIcon col="name" sortCol={sortCol} sortDir={sortDir} />
              </th>
              {weekDays.map(day => (
                <th key={day.toISOString()} className={dateThCls}>
                  {fmtColDate(day)} <SortIcon col={day.toISOString()} sortCol={sortCol} sortDir={sortDir} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map(row => {
              // compute weekly P/L totals for name cell


              return ( 
                <tr key={row.id} className={trCls}>
                  {/* Name cell */}
                  <td
  className={`px-4 py-3 sticky left-0 z-10 align-middle ${
    isDark
      ? "text-gray-200 bg-[#111111]"
      : "text-gray-800 bg-white"
  }`}
>
  {/* Employee Name */}
  <div className="font-medium">
    {row.name}
  </div>

  {/* Planned / Logged */}
  <div className="flex items-center gap-1 mt-0.5 text-xs">
    <span className={t.textSecondary}>
      P : {row.total_planned}
    </span>

    <span className={t.textMuted}>
      |
    </span>

    <span
      className={
        row.total_logged > row.total_planned
          ? "text-red-500"
          : t.textMuted
      }
    >
      L : {row.total_logged}
    </span>
  </div>
</td>
                  {/* Day cells */}
                  {weekDays.map((day) => {
  const key = getLocalDateKey(day);

  return (
    <DayCell
      key={key}
      entry={row.dailyData[key]}
      isDark={isDark}
      t={t}
      onCellClick={() =>
  handleTaskPopup(
    row,
    day,
    row.dailyData[key],
    key
  )
}
    />
  );
})}
                </tr>
              );
            })}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={weekDays.length + 1} className={`px-4 py-10 text-center h-[calc(100vh-20rem)] ${t.textMuted}`}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        hasPrev={hasPrev}
        hasNext={hasNext}
        prevPage={prevPage}
        nextPage={nextPage}
        pageNumbers={pageNumbers}
        setPage={setPage}
      />
     <EmployeeTaskDetailsModal
  open={taskPopupOpen}
  onOpenChange={setTaskPopupOpen}
  employee={selectedEmployee}
  date={selectedDate}
  entry={selectedEntry}
  taskDetails={taskDetails}
  loading={taskDetailsLoading}
  onReassigned={handleTaskReassigned}
/>
    </div>
  );
}
