"use client";

import { useState, useMemo, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import WeekRangePicker from "./WeekRangePicker";
import { useTheme } from "../context/ThemeContext";

const SEED_START = new Date("2026-02-04");
const SEED_END   = new Date("2026-02-10");

// ── Real backend data (Tech team) ─────────────────────────────────────────────
const TECH_API_DATA = {"employees":[{"empId":121,"employee_Name":"Abhishek Badiger","total_planned":19.5,"total_logged":19,"dates":[{"date":"02/04/2026","planned":4.5,"logged":4,"available":4.5},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":1,"logged":1,"available":8},{"date":"02/09/2026","planned":7,"logged":7,"available":2},{"date":"02/10/2026","planned":7,"logged":7,"available":2}]},{"empId":169,"employee_Name":"Ananya M","total_planned":0,"total_logged":24,"dates":[{"date":"02/04/2026","planned":0,"logged":8,"available":9},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":0,"logged":0,"available":9},{"date":"02/09/2026","planned":0,"logged":8,"available":9},{"date":"02/10/2026","planned":0,"logged":8,"available":9}]},{"empId":27,"employee_Name":"Avinash Ranchagi","total_planned":24,"total_logged":35,"dates":[{"date":"02/04/2026","planned":2,"logged":6,"available":7},{"date":"02/05/2026","planned":6,"logged":8,"available":3},{"date":"02/06/2026","planned":9,"logged":9,"available":0},{"date":"02/09/2026","planned":2,"logged":5,"available":7},{"date":"02/10/2026","planned":5,"logged":7,"available":4}]},{"empId":69,"employee_Name":"Bharathkumar Duragappa","total_planned":25,"total_logged":32,"dates":[{"date":"02/04/2026","planned":4,"logged":8,"available":5},{"date":"02/05/2026","planned":6,"logged":7,"available":3},{"date":"02/06/2026","planned":1,"logged":4,"available":8},{"date":"02/09/2026","planned":7,"logged":6,"available":2},{"date":"02/10/2026","planned":7,"logged":7,"available":2}]},{"empId":73,"employee_Name":"Darshan T","total_planned":12.5,"total_logged":15,"dates":[{"date":"02/04/2026","planned":0.5,"logged":0.5,"available":8.5},{"date":"02/05/2026","planned":5.5,"logged":7,"available":3.5},{"date":"02/06/2026","planned":2,"logged":3,"available":7},{"date":"02/09/2026","planned":2,"logged":2,"available":7},{"date":"02/10/2026","planned":2.5,"logged":2.5,"available":6.5}]},{"empId":92,"employee_Name":"Jayashree k","total_planned":21,"total_logged":21,"dates":[{"date":"02/04/2026","planned":0,"logged":0,"available":9},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":7,"logged":7,"available":2},{"date":"02/09/2026","planned":7,"logged":7,"available":2},{"date":"02/10/2026","planned":7,"logged":7,"available":2}]},{"empId":1179,"employee_Name":"Lalith Kumar Reddy K","total_planned":0,"total_logged":0,"dates":[{"date":"02/04/2026","planned":0,"logged":0,"available":9},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":0,"logged":0,"available":9},{"date":"02/09/2026","planned":0,"logged":0,"available":9},{"date":"02/10/2026","planned":0,"logged":0,"available":9}]},{"empId":124,"employee_Name":"Manish BK","total_planned":22,"total_logged":29,"dates":[{"date":"02/04/2026","planned":7,"logged":5,"available":2},{"date":"02/05/2026","planned":2,"logged":7,"available":7},{"date":"02/06/2026","planned":3,"logged":3,"available":6},{"date":"02/09/2026","planned":7,"logged":7,"available":2},{"date":"02/10/2026","planned":3,"logged":7,"available":6}]},{"empId":1176,"employee_Name":"Monika H M","total_planned":0,"total_logged":0,"dates":[{"date":"02/04/2026","planned":0,"logged":0,"available":9},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":0,"logged":0,"available":9},{"date":"02/09/2026","planned":0,"logged":0,"available":9},{"date":"02/10/2026","planned":0,"logged":0,"available":9}]},{"empId":1178,"employee_Name":"Poorvik K M","total_planned":0,"total_logged":0,"dates":[{"date":"02/04/2026","planned":0,"logged":0,"available":9},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":0,"logged":0,"available":9},{"date":"02/09/2026","planned":0,"logged":0,"available":9},{"date":"02/10/2026","planned":0,"logged":0,"available":9}]},{"empId":42,"employee_Name":"Rahul Konka","total_planned":3,"total_logged":8,"dates":[{"date":"02/04/2026","planned":1,"logged":1,"available":8},{"date":"02/05/2026","planned":2,"logged":4,"available":7},{"date":"02/06/2026","planned":0,"logged":1,"available":9},{"date":"02/09/2026","planned":0,"logged":1,"available":9},{"date":"02/10/2026","planned":0,"logged":1,"available":9}]},{"empId":154,"employee_Name":"Ramakanth Rao R","total_planned":24,"total_logged":24,"dates":[{"date":"02/04/2026","planned":7,"logged":7,"available":2},{"date":"02/05/2026","planned":4,"logged":4,"available":5},{"date":"02/06/2026","planned":7,"logged":7,"available":2},{"date":"02/09/2026","planned":0,"logged":0,"available":9},{"date":"02/10/2026","planned":6,"logged":6,"available":3}]},{"empId":123,"employee_Name":"Sanjay Devarjankar","total_planned":32,"total_logged":32,"dates":[{"date":"02/04/2026","planned":4,"logged":4,"available":5},{"date":"02/05/2026","planned":5,"logged":5,"available":4},{"date":"02/06/2026","planned":8,"logged":8,"available":1},{"date":"02/09/2026","planned":8,"logged":8,"available":1},{"date":"02/10/2026","planned":7,"logged":7,"available":2}]},{"empId":122,"employee_Name":"Souvik Das","total_planned":13,"total_logged":13,"dates":[{"date":"02/04/2026","planned":9,"logged":9,"available":0},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":0,"logged":0,"available":9},{"date":"02/09/2026","planned":0,"logged":0,"available":9},{"date":"02/10/2026","planned":4,"logged":4,"available":5}]},{"empId":1,"employee_Name":"Stalin Blazy","total_planned":33.5,"total_logged":33.5,"dates":[{"date":"02/04/2026","planned":4.5,"logged":4.5,"available":4.5},{"date":"02/05/2026","planned":5,"logged":5,"available":4},{"date":"02/06/2026","planned":7.5,"logged":10,"available":1.5},{"date":"02/09/2026","planned":9,"logged":7.5,"available":0},{"date":"02/10/2026","planned":7.5,"logged":6.5,"available":1.5}]},{"empId":1177,"employee_Name":"Yogesh Periyasami","total_planned":0,"total_logged":0,"dates":[{"date":"02/04/2026","planned":0,"logged":0,"available":9},{"date":"02/05/2026","planned":0,"logged":0,"available":9},{"date":"02/06/2026","planned":0,"logged":0,"available":9},{"date":"02/09/2026","planned":0,"logged":0,"available":9},{"date":"02/10/2026","planned":0,"logged":0,"available":9}]}]};

// Parse date string to ISO key YYYY-MM-DD (handles both MM/DD/YYYY and YYYY-MM-DD)
function parseDateKey(dateStr) {
  if (dateStr.includes("-")) return dateStr; // already YYYY-MM-DD
  const [mm, dd, yyyy] = dateStr.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

// Format a Date object to YYYY-MM-DD for API requests
function fmtApiDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Transform backend response into the internal row format
function transformApiData(apiData, dept) {
  return apiData.employees.map(emp => {
    const dailyData = {};
    emp.dates.forEach(({ date, planned, logged, available }) => {
      const key = parseDateKey(date);
      if (planned === 0 && logged === 0 && available === 0) {
        // no capacity (e.g. test/inactive employee)
        dailyData[key] = { type: "dot" };
      } else if (planned === 0 && logged === 0) {
        dailyData[key] = { type: "available" };
      } else {
        dailyData[key] = { type: "data", p: planned, a: available, l: logged };
      }
    });
    return { id: emp.empId, name: emp.employee_Name, dept, dailyData, total_planned: emp.total_planned, total_logged: emp.total_logged };
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

function DayCell({ entry, isDark, t }) {
  if (!entry) return <td className={`px-4 py-3 text-center ${t.textMuted}`}>—</td>;

  if (entry.type === "dot" || entry.type === "available") {
    return (
      <td className="px-4 py-3 text-center">
        <span className="text-blue-500 font-semibold text-sm">A</span>
      </td>
    );
  }

  const { p, a, l } = entry;
  const pPct = Math.min((p / 9) * 100, 100);
  const lPct = Math.min((l / 9) * 100, 100);
  const barColor = p > 8 ? "bg-red-500" : p > 4.5 ? "bg-orange-400" : "bg-green-500";

  return (
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 text-xs justify-center mb-1">
        <span className={`font-medium ${t.textPrimary}`}>P:{p}</span>
        <span className={t.textMuted}>|</span>
        <span className="text-blue-500 font-medium">A:{a}</span>
        <span className={t.textMuted}>|</span>
        <span className={l > p && p > 0 ? "text-red-500 font-medium" : t.textMuted}>L:{l}</span>
      </div>
      <div className={`relative h-1 w-full rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
        <div className={`absolute left-0 top-0 h-full rounded-full ${barColor}`} style={{ width: `${pPct}%` }} />
        {l > p && p > 0 && <div className="absolute top-0 h-full rounded-full bg-red-400" style={{ width: `${lPct}%` }} />}
      </div>
    </td>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  return (
    <span className="inline-flex flex-col ml-1 opacity-50">
      <ChevronUp   size={10} className={sortCol === col && sortDir === "asc"  ? "opacity-100 text-red-500" : ""} />
      <ChevronDown size={10} className={sortCol === col && sortDir === "desc" ? "opacity-100 text-red-500" : ""} style={{ marginTop: -4 }} />
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TABS  = ["Content", "Creative", "Tech", "PM's", "AM's"];
const TAB_IDS = { "Content": 1, "Creative": 2, "Tech": 3, "PM's": 4, "AM's": 5 };
const PAGE_SIZE = 10;

export default function WeekUtilizationTable() {
  const { t, isDark } = useTheme();

  const [startDate,  setStartDate]  = useState(SEED_START);
  const [endDate,    setEndDate]    = useState(SEED_END);
  const [activeTab,  setActiveTab]  = useState("Content");
  const [search,     setSearch]     = useState("");
  const [sortCol,    setSortCol]    = useState("name");
  const [sortDir,    setSortDir]    = useState("asc");
  const [page,       setPage]       = useState(1);


  const allData  = useRef(transformApiData(TECH_API_DATA, "Tech")).current;
  const weekDays = useMemo(() => getDatesInRange(startDate, endDate), [startDate, endDate]);

  function handleRangeChange(s, e) { setStartDate(s); setEndDate(e); setPage(1); }

  const filtered = useMemo(() => {
    // For Tech tab use real data; other tabs show empty until wired up
    let rows = activeTab === "Tech" ? allData : [];
    if (search.trim()) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    rows = [...rows].sort((a, b) => {
      const av = a.name.toLowerCase(), bv = b.name.toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return rows;
  }, [allData, activeTab, search, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  function handleTabChange(tab) { setActiveTab(tab); setPage(1); }
  function handleSearch(e)      { setSearch(e.target.value); setPage(1); }

  const card   = isDark ? "bg-[#111111] border border-white/5" : "bg-white border border-gray-200";
  const thCls  = `px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap
    ${isDark ? "text-gray-400 bg-[#1a1a1a]" : "text-gray-500 bg-gray-50"}`;
  const trCls  = `border-t transition-colors ${isDark ? "border-white/5 hover:bg-white/3" : "border-gray-100 hover:bg-gray-50"}`;

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
      <div className={`px-6 py-3 flex justify-end border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${t.textSecondary}`}>Search:</span>
          <input
            value={search}
            onChange={handleSearch}
            className={`w-44 px-3 py-1.5 rounded-lg text-sm border outline-none transition-colors
              ${isDark
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
                <th key={day.toISOString()} className={`${thCls} min-w-[160px]`}>
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
                  <td className={`px-4 py-3 sticky left-0 z-10 ${isDark ? "text-gray-200 bg-[#111111]" : "text-gray-800 bg-white"}`}>
                    <div className="font-medium">{row.name}</div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs">
                      <span className={t.textSecondary}>P : {row.total_planned}</span>
                      <span className={t.textMuted}>|</span>
                      <span className={row.total_logged > row.total_planned ? "text-red-500" : t.textMuted}>L : {row.total_logged}</span>
                    </div>
                  </td>
                  {/* Day cells */}
                  {weekDays.map(day => {
                    const key = day.toISOString().slice(0, 10);
                    return <DayCell key={key} entry={row.dailyData[key]} isDark={isDark} t={t} />;
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
      <div className={`px-6 py-3 flex items-center justify-between text-sm border-t ${isDark ? "border-white/5 text-gray-400" : "border-gray-100 text-gray-500"}`}>
        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded-lg transition-colors disabled:opacity-40
              ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                ${p === page ? "bg-red-500 text-white" : isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded-lg transition-colors disabled:opacity-40
              ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}
