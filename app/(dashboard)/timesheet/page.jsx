"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import WeekRangePicker from "../../components/WeekRangePicker";
import { usePagination } from "../../../hooks/usePagination";

import StatCard from "./components/statCard";
import UtilizationCard from "./components/UtilizationCard";
import TimesheetTable from "./components/TimesheetTable";
import CustomSelect from "@/components/ui/CustomSelect";

import { TASKS, DAY_KEYS } from "./data";

import {
  startOfWeek,
  addDays,
  formatMDY,
  hoursLabel,
} from "./util";

export default function TimesheetPage() {
  const { t, isDark } = useTheme();

  const [search, setSearch] = useState("");
  const [data, setData] = useState(TASKS);

  // Week Dates
  const [startDate, setStartDate] = useState(() => startOfWeek(new Date()));
  const [endDate, setEndDate] = useState(() => addDays(startOfWeek(new Date()), 4));

  const weekDates = useMemo(() => {
    const dates = [];
    const cur = new Date(startDate);
    while (cur <= endDate) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }, [startDate, endDate]);

  // Card Totals
  const totals = useMemo(() => {
    let planned = 0;
    let actual = 0;

    data.forEach((task) => {
      DAY_KEYS.forEach((day) => {
        planned += Number(task.planned[day]) || 0;
        actual += Number(task.actual[day]) || 0;
      });
    });

    return {
      planned,
      actual,
      variance: actual - planned,
      utilization:
        planned > 0
          ? Math.round((actual / planned) * 100)
          : 0,
    };
  }, [data]);

  // Search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return data;

    return data.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        task.owner.toLowerCase().includes(q) ||
        task.id.includes(q)
    );
  }, [data, search]);

  // Pagination
const {
  paginatedData: pageRows,
  page: clampedPage,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  pageNumbers,
} = usePagination({
  data: filtered,
  pageSize: 50,
});

  // Update Actual Hours
  function updateActual(taskId, dayKey, value) {
    const num =
      value === ""
        ? ""
        : Math.max(0, Math.min(24, Number(value)));

    setData((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              actual: {
                ...task.actual,
                [dayKey]: num,
              },
            }
          : task
      )
    );
  }

  // Theme Classes
  const border = isDark
    ? "border-white/10"
    : "border-gray-200";

  const headerBg = isDark
    ? "bg-white/[0.04]"
    : "bg-gray-50";

  const rowLabelColor = isDark
    ? "text-gray-500"
    : "text-gray-400";

  const inputBg = isDark
    ? "bg-white/5"
    : "bg-white";

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col p-6 overflow-hidden">

      {/* Summary Cards */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <StatCard
          icon={Calendar}
          tone="red"
          label="Planned Hours"
          value={hoursLabel(totals.planned)}
          caption="This Week"
          isDark={isDark}
        />

        <StatCard
          icon={Clock}
          tone="green"
          label="Actual Hours"
          value={hoursLabel(totals.actual)}
          caption="This Week"
          isDark={isDark}
        />

        <StatCard
          icon={
            totals.variance < 0
              ? TrendingDown
              : TrendingUp
          }
          tone="blue"
          label="Variance"
          value={hoursLabel(totals.variance)}
          caption="This Week"
          isDark={isDark}
        />

        <UtilizationCard
          percent={totals.utilization}
          isDark={isDark}
        />

      </div>


      <div className="flex flex-wrap items-center justify-end gap-6 py-5">

        <WeekRangePicker
          start={startDate}
          end={endDate}
          onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
                    <span>Show</span>
                    <div className="rounded-lg border border-input bg-background">
                      <CustomSelect
          value={String(pageSize)}
          onChange={(value) =>
            setPagination((prev) => ({
              ...prev,
              pageSize: Number(value),
              pageIndex: 0,
            }))
          }
          options={[
            { value: "10", label: "10" },
            { value: "25", label: "25" },
            { value: "50", label: "50" },
            { value: "100", label: "100" },
          ]}
        />
                    </div>
                    <span>entries</span>
                  </div>

        <div
          className={`flex items-center gap-2 text-sm ${t.textSecondary}`}
        >
          Search:

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Task, owner or ID"
            className={`w-56 rounded-lg border ${border} ${inputBg} px-3 py-1.5 text-sm ${t.textPrimary}`}
          />
        </div>

      </div>

      {/* Table */}

      <TimesheetTable
  pageRows={pageRows}
  weekDates={weekDates}
  border={border}
  headerBg={headerBg}
  rowLabelColor={rowLabelColor}
  inputBg={inputBg}
  t={t}
  isDark={isDark}
  updateActual={updateActual}
  filtered={filtered}
  clampedPage={clampedPage}
  pageSize={pageSize}
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
  formatMDY={formatMDY}
/>

    </div>
  );
}