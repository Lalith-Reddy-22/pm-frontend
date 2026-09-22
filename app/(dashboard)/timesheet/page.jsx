"use client";

import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import WeekRangePicker from "../../components/WeekRangePicker";
import { usePagination } from "../../../hooks/usePagination";
import TaskCommentModal from "./components/TaskCommentModal";
import StatCard from "./components/statCard";
import UtilizationCard from "./components/UtilizationCard";
import TimesheetTable from "./components/TimesheetTable";
import CustomSelect from "@/components/ui/CustomSelect";
import { useMemo, useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { addTaskComment } from "@/store/slices/timesheetSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTimesheet
} from "@/store/slices/timesheetSlice";
import { DAY_KEYS } from "./data";
import {
  startOfWeek,
  addDays,
  formatMDY,
  hoursLabel,
} from "./util";

function formatApiDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateInput(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const isoMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (slashMatch) {
    const [, month, day, year] = slashMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateKey(date) {
  const d = parseDateInput(date);
  if (!d) return null;

  d.setHours(0, 0, 0, 0);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TimesheetPage() {
  const dispatch = useDispatch();

  const {
  tasks: apiTasks,
  loading,
  error,
  rescheduleLoading,
  rescheduleError,
  rescheduleSuccess,
  commentLoading,
  commentError,
  commentSuccess,
} = useSelector((state) => state.timesheet);

  const [search, setSearch] = useState("");

const [commentTask, setCommentTask] = useState(null);
const [commentText, setCommentText] = useState("");


  // Week Dates
  const [startDate, setStartDate] = useState(() =>
    startOfWeek(new Date())
  );

  const [endDate, setEndDate] = useState(() =>
    addDays(startOfWeek(new Date()), 4)
  );

  const [localTaskEdits, setLocalTaskEdits] = useState({});

  const data = useMemo(() => {
    return (apiTasks || []).map((task) => {
      const planned = {};
      const actual = {};

      (task.dates || []).forEach((date) => {
        if (!date.allocated_Date) return;

        const dateKey = toDateKey(date.allocated_Date);
        if (!dateKey) return;

        planned[dateKey] = Number(date.working_hours ?? date.Working_hours) || 0;
        actual[dateKey] = Number(date.loghours ?? date.Loghours) || 0;
      });

      const taskId = String(task.task_Id ?? task.Task_Id ?? task.id ?? task.taskID ?? "");
      const taskEdits = localTaskEdits[taskId] || {};

      if (taskEdits.planned) {
        Object.entries(taskEdits.planned).forEach(([key, value]) => {
          planned[key] = value;
        });
      }

      if (taskEdits.actual) {
        Object.entries(taskEdits.actual).forEach(([key, value]) => {
          actual[key] = value;
        });
      }

      return {
        id: taskId,
        title: task.task_Title || "",
        owner: task.taskowner || "",
        priority: task.tskpriority || "MEDIUM",
        buyingCenterId: Number(task.buyingCenterId) || 0,
        planned,
        actual,
        dates: task.dates || [],
      };
    });
  }, [apiTasks, localTaskEdits]);

  const rowData = useMemo(() => {
    const rowsByTask = new Map();

    (apiTasks || []).forEach((task) => {
      const taskId = String(task.task_Id ?? task.Task_Id ?? task.id ?? task.taskID ?? "");
      const taskEdits = localTaskEdits[taskId] || {};
      const taskDates = Array.isArray(task.dates) ? task.dates : Array.isArray(task.Dates) ? task.Dates : [];
      const title = task.task_Title || task.Task_Title || task.title || "";
      const owner = task.taskowner || task.Taskowner || task.owner || "";
      const priority = task.tskpriority || task.Priority || task.priority || "MEDIUM";

      if (!rowsByTask.has(taskId)) {
        rowsByTask.set(taskId, {
          id: taskId,
          taskId,
          title,
          owner,
          priority,
          planned: {},
          actual: {},
          entryDate: null,
        });
      }

      const row = rowsByTask.get(taskId);

      if (!taskDates.length) {
        return;
      }

      taskDates.forEach((entry) => {
        if (!entry.allocated_Date) return;

        const dateKey = toDateKey(entry.allocated_Date);
        if (!dateKey) return;

        const plannedValue =
          (taskEdits.planned?.[dateKey] ?? Number(entry.working_hours ?? entry.Working_hours)) || 0;

        const actualValue =
          (taskEdits.actual?.[dateKey] ?? Number(entry.loghours ?? entry.Loghours)) || 0;

        row.planned[dateKey] = Number(plannedValue) || 0;
        row.actual[dateKey] = Number(actualValue) || 0;
        row.entryDate = row.entryDate ?? dateKey;
      });
    });

    return Array.from(rowsByTask.values());
  }, [apiTasks, localTaskEdits]);

  const handleCommentSubmit = () => {
  if (!commentTask || !commentText.trim()) {
    return;
  }

  const plannedHours = Object.values(
    commentTask.planned || {}
  ).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  const actualHours = Object.values(
    commentTask.actual || {}
  ).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  dispatch(
    addTaskComment({
      taskId: Number(commentTask.id),

      // Temporary - replace with logged-in employee ID
      employeeId: 10,

      commentType:
        actualHours > plannedHours
          ? "Overtime"
          : "Underallocated",

      commentText: commentText.trim(),

      plannedHours,

      actualHours,

      // Temporary - replace with logged-in employee ID
      createdBy: 10,
    })
  );
};

  // Fetch timesheet whenever week changes
// 1. Fetch API
useEffect(() => {
  const empId = 10;

  dispatch(
    fetchTimesheet({
      empId,
      startDate: formatApiDate(startDate),
      endDate: formatApiDate(endDate),
    })
  );
}, [dispatch, startDate, endDate]);



  const { t, isDark } = useTheme();

  const weekDates = useMemo(() => {
    const dates = [];
    const cur = new Date(startDate);
    const end = new Date(endDate);
    cur.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (cur <= end) {
      dates.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }

    return dates;
  }, [startDate, endDate]);

  // Card Totals
 
  const totals = useMemo(() => {
  let planned = 0;
  let actual = 0;

  data.forEach((task) => {
    Object.values(task.planned || {}).forEach((hours) => {
      planned += Number(hours) || 0;
    });

    Object.values(task.actual || {}).forEach((hours) => {
      actual += Number(hours) || 0;
    });
  });

  const variance = actual - planned;

  const utilization =
    planned > 0
      ? Math.round((actual / planned) * 100)
      : 0;

  return {
    planned,
    actual,
    variance,
    utilization,
  };
}, [data]);

  // Search
 const filtered = useMemo(() => {
  const q = search.trim().toLowerCase();

  if (!q) return rowData;

  return rowData.filter(
    (task) =>
      (task.title || "").toLowerCase().includes(q) ||
      (task.owner || "").toLowerCase().includes(q) ||
      String(task.taskId || task.id || "").includes(q)
  );
}, [rowData, search]);

function updatePlanned(taskId, dateKey, value) {
  const num =
    value === ""
      ? ""
      : Math.max(0, Math.min(24, Number(value)));

  setLocalTaskEdits((prev) => ({
    ...prev,
    [taskId]: {
      ...(prev[taskId] || {}),
      planned: {
        ...((prev[taskId] && prev[taskId].planned) || {}),
        [dateKey]: num,
      },
    },
  }));
}

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
  function updateActual(taskId, dateKey, value) {
    const num =
      value === ""
        ? ""
        : Math.max(0, Math.min(24, Number(value)));

    setLocalTaskEdits((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        actual: {
          ...((prev[taskId] && prev[taskId].actual) || {}),
          [dateKey]: num,
        },
      },
    }));
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

      {/* Billing Tabs + Controls */}
<div className="flex flex-wrap items-center justify-end gap-6 py-5">
       

        {/* Right Controls */}
        <div className="flex flex-wrap items-center justify-end gap-6">

          {/* Week Picker */}
          <WeekRangePicker
            start={startDate}
            end={endDate}
            onChange={(s, e) => {
              setStartDate(s);
              setEndDate(e);
            }}
          />

          {/* Page Size */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">

            <span>Show</span>

            <div className="rounded-lg border border-input bg-background">

              <CustomSelect
                value={String(pageSize)}
                onChange={(value) => {
                  setPageSize(Number(value));
                }}
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

          {/* Search */}
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
  updatePlanned={updatePlanned}
  updateActual={updateActual}

  onComment={(task) => {
    console.log("COMMENT TASK FROM TABLE:", task);

    setCommentTask(task);
    setCommentText("");
  }}

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

<TaskCommentModal
  open={Boolean(commentTask)}
  task={commentTask}
  commentText={commentText}
  setCommentText={setCommentText}
  loading={commentLoading}
  error={commentError}
  onClose={() => {
    setCommentTask(null);
    setCommentText("");
  }}
  onSubmit={handleCommentSubmit}
/>

    

    </div>
  );
}