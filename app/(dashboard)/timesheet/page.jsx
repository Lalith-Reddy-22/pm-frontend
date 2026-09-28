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
import { api } from "@/lib/api";

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

function getTaskValue(task, keys) {
  for (const key of keys) {
    const value = task?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "";
}

function getLoggedInEmpId() {
  if (typeof window === "undefined") return 0;

  const value = Number(sessionStorage.getItem("empId") || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function normalizeTaskId(task) {
  const value = getTaskValue(task, [
    "task_Id",
    "Task_Id",
    "Task_ID",
    "taskId",
    "taskID",
    "id",
    "Id",
  ]);

  return value === "" ? "" : String(value);
}

function normalizeTaskTitle(task) {
  return String(
    getTaskValue(task, [
      "task_Title",
      "Task_Title",
      "taskTitle",
      "TaskTitle",
      "taskName",
      "TaskName",
      "title",
      "Title",
      "name",
      "Name",
    ]) ?? ""
  );
}

function normalizeOwner(task) {
  return String(
    getTaskValue(task, [
      "taskowner",
      "Taskowner",
      "taskOwner",
      "taskOwnerName",
      "employeeName",
      "EmployeeName",
      "owner",
      "Owner",
    ]) ?? ""
  );
}

function normalizePriority(task) {
  return String(
    getTaskValue(task, [
      "tskpriority",
      "TaskPriority",
      "taskPriority",
      "priority",
      "Priority",
      "priorityName",
    ]) ?? "MEDIUM"
  );
}

function getDateValueFromEntry(entry) {
  const date =
    entry?.allocated_Date ??
    entry?.Allocated_Date ??
    entry?.allocationDate ??
    entry?.AllocationDate ??
    entry?.date ??
    entry?.allocatedDate ??
    entry?.AllocatedDate ??
    null;

  return date;
}

function getPlannedHoursValue(entry) {
  return Number(
    entry?.working_hours ??
    entry?.Working_hours ??
    entry?.hours ??
    entry?.plannedHours ??
    entry?.PlannedHours ??
    entry?.allocatedHours ??
    entry?.AllocatedHours ??
    0
  );
}

function getActualHoursValue(entry) {
  const value =
    entry?.loghours ??
    entry?.Loghours ??
    entry?.actualHours ??
    entry?.ActualHours ??
    entry?.logHours ??
    entry?.LogHours ??
    entry?.hoursLogged ??
    entry?.hoursWorked ??
    entry?.loggedHours;

  // No actual hours logged yet
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return Number(value) || 0;
}

function extractTaskDates(task) {
  if (Array.isArray(task?.dates)) return task.dates;
  if (Array.isArray(task?.Dates)) return task.Dates;
  if (Array.isArray(task?.dateList)) return task.dateList;
  if (Array.isArray(task?.dailyAllocations)) return task.dailyAllocations;
  if (Array.isArray(task?.employeeAllocations)) {
    return task.employeeAllocations.flatMap((employee) => employee?.dailyAllocations || []);
  }
  return [];
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
  const [saveNotice, setSaveNotice] = useState(null);

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
      const taskDates = extractTaskDates(task);

      taskDates.forEach((date) => {
        const allocatedDate = getDateValueFromEntry(date);
        if (!allocatedDate) return;

        const dateKey = toDateKey(allocatedDate);
        if (!dateKey) return;

        planned[dateKey] = getPlannedHoursValue(date) || 0;
actual[dateKey] = getActualHoursValue(date);
      });

      const taskId = normalizeTaskId(task);
      const taskEdits = localTaskEdits[taskId] || {};

      if (taskEdits.planned) {
        Object.entries(taskEdits.planned).forEach(([key, value]) => {
          planned[key] = value === "" ? "" : Number(value) || 0;
        });
      }

      if (taskEdits.actual) {
        Object.entries(taskEdits.actual).forEach(([key, value]) => {
          actual[key] = value === "" ? "" : Number(value) || 0;
        });
      }

      return {
        id: taskId,
        title: normalizeTaskTitle(task),
        owner: normalizeOwner(task),
        priority: normalizePriority(task),
        buyingCenterId: Number(task.buyingCenterId ?? task.buying_Center_Id ?? 0) || 0,
        planned,
        actual,
        dates: taskDates,
      };
    });
  }, [apiTasks, localTaskEdits]);

  useEffect(() => {
    if (!saveNotice) return;

    const timer = setTimeout(() => {
      setSaveNotice(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [saveNotice]);

  const rowData = useMemo(() => {
    const rowsByTask = new Map();

    (apiTasks || []).forEach((task) => {
      const taskId = normalizeTaskId(task);
      const taskEdits = localTaskEdits[taskId] || {};
      const taskDates = extractTaskDates(task);
      const title = normalizeTaskTitle(task);
      const owner = normalizeOwner(task);
      const priority = normalizePriority(task);

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
        const allocatedDate = getDateValueFromEntry(entry);
        if (!allocatedDate) return;

        const dateKey = toDateKey(allocatedDate);
        if (!dateKey) return;

        const editedPlannedValue = taskEdits.planned?.[dateKey];
        const editedActualValue = taskEdits.actual?.[dateKey];

        const plannedValue =
          editedPlannedValue === undefined
            ? getPlannedHoursValue(entry)
            : editedPlannedValue === ""
              ? ""
              : Number(editedPlannedValue) || 0;

        const actualValue =
          editedActualValue === undefined
            ? getActualHoursValue(entry)
            : editedActualValue === ""
              ? ""
              : Number(editedActualValue) || 0;

        row.planned[dateKey] = plannedValue === "" ? "" : Number(plannedValue) || 0;
        row.actual[dateKey] = actualValue === "" ? "" : Number(actualValue) || 0;
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
useEffect(() => {
  const empId = getLoggedInEmpId();

  if (!empId) return;

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

  return rowData.filter((task) => {
    const searchableText = [
      task.title,
      task.owner,
      task.priority,
      task.id,
      task.taskId,
    ]
      .filter((value) => value !== null && value !== undefined && value !== "")
      .map((value) => String(value).toLowerCase())
      .join(" ");

    return searchableText.includes(q);
  });
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

  async function persistActualHours(taskId, dateKey, value) {
    if (!taskId || !dateKey) return;

    const parsedTaskId = Number(taskId);
    if (!Number.isFinite(parsedTaskId) || parsedTaskId <= 0) return;

    const numericValue =
      value === "" ? 0 : Math.max(0, Math.min(24, Number(value)));

    if (!Number.isFinite(Number(numericValue))) return;

    const empId = getLoggedInEmpId();
    if (!empId) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await api.post("/api/Timesheet/log", {
        timeLogId: 0,
        taskId: parsedTaskId,
        empId,
        logDate: dateKey,
        logHours: Number(numericValue),
        notes: "",
      });

      setSaveNotice({
        type: "success",
        message: `Actual hours saved successfully for ${dateKey}.`,
      });

      dispatch(
        fetchTimesheet({
          empId,
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate),
        })
      );
    } catch (error) {
      console.error("PERSIST ACTUAL HOURS ERROR:", error);
      setSaveNotice({
        type: "error",
        message: "Unable to save actual hours. Please try again.",
      });
    }
  }

  // Update Actual Hours
  function updateActual(taskId, dateKey, value) {
    if (value === "") {
      setLocalTaskEdits((prev) => ({
        ...prev,
        [taskId]: {
          ...(prev[taskId] || {}),
          actual: {
            ...((prev[taskId] && prev[taskId].actual) || {}),
            [dateKey]: "",
          },
        },
      }));
      return;
    }

    const num = Math.max(0, Math.min(24, Number(value)));

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

    if (Number.isFinite(num)) {
      persistActualHours(taskId, dateKey, num);
    }
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
      {saveNotice && (
        <div className="pointer-events-none fixed right-4 top-4 z-50">
          <div
            aria-live="polite"
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
              saveNotice.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                saveNotice.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium">{saveNotice.message}</span>
            <button
              type="button"
              onClick={() => setSaveNotice(null)}
              className="ml-1 text-lg leading-none text-current opacity-70 transition hover:opacity-100"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}

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