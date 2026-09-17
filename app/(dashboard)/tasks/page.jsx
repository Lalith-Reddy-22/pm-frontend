"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import TaskList from "./TaskList";
import {
  fetchTasks,
  fetchTaskById,
  fetchEmployeeNames,
  deleteTask,
} from "@/store/slices/taskSlice";
function TasksPageInner() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();

const taskIdFromNotification =
  searchParams.get("taskId");

const employeeIdFromUrl =
  searchParams.get("empId");

const userTypeFromUrl =
  searchParams.get("userType");

  console.log(
    "TASK ID FROM NOTIFICATION:",
    taskIdFromNotification
  );

  const [dateRange, setDateRange] = useState({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 11, 31),
  });

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const {
  tasks,
  loading,
  error,
  totalCount,
  totalPages,
  pageNumber,
  pageSize,

  selectedTask,
  selectedTaskLoading,
  selectedTaskError,

  employeeNames,
  projects,
  projectsLoading,
  employeeNamesLoading,
} = useSelector((state) => state.task);

  function formatDate(date) {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(
      2,
      "0"
    );
    const day = String(date.getDate()).padStart(
      2,
      "0"
    );

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
  if (!taskIdFromNotification) return;

  console.log(
    "FETCHING NOTIFICATION TASK:",
    taskIdFromNotification
  );

  dispatch(
    fetchTaskById(
      Number(taskIdFromNotification)
    )
  );
}, [
  dispatch,
  taskIdFromNotification,
]);

useEffect(() => {
  if (!taskIdFromNotification) return;

  dispatch(fetchEmployeeNames());
}, [
  dispatch,
  taskIdFromNotification,
]);

const employeeNameMap = Object.fromEntries(
  employeeNames.map((employee) => [
    String(employee.employeeId),
    employee.employeeName,
  ])
);

console.log(
  "SELECTED TASK PROJECT ID:",
  selectedTask?.projectId
);

console.log(
  "PROJECT 415:",
  projects.find(
    (project) =>
      String(project.project_Id) ===
      String(selectedTask?.projectId)
  )
);

console.log(
  "TOTAL PROJECTS LOADED:",
  projects.length
);

const notificationTask =
  selectedTask && taskIdFromNotification
    ? {
        ...selectedTask,

        employees: selectedTask.empIds
          ? selectedTask.empIds
              .split(",")
              .map(
                (id) =>
                  employeeNameMap[
                    String(id).trim()
                  ]
              )
              .filter(Boolean)
          : [],

        // -----------------------------------------
        // RESCHEDULE DATES
        // -----------------------------------------
        dates: (() => {
          const allocations =
            selectedTask.employeeAllocations
              ?.flatMap(
                (employee) =>
                  employee.dailyAllocations || []
              ) || [];

          const uniqueDates = new Map();

          allocations.forEach((allocation) => {
            if (!allocation.allocationDate)
              return;

            const date =
              allocation.allocationDate;

            if (!uniqueDates.has(date)) {
              uniqueDates.set(date, {
                allocated_Date: date,

                working_hours:
                  allocation.hours || 0,

                start_time:
                  allocation.startTime || "",

                end_time:
                  allocation.endTime || "",
              });
            }
          });

          return Array.from(
            uniqueDates.values()
          );
        })(),
      }
    : null;
    
    console.log(
  "FINAL NOTIFICATION TASK:",
  notificationTask
);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
  if (taskIdFromNotification) return;

  // If empId/userType are provided in the URL,
  // use them. Otherwise use the logged-in user's values.
  const empId = Number(
    employeeIdFromUrl ||
      sessionStorage.getItem("empId") ||
      0
  );

  const userType = Number(
    userTypeFromUrl ||
      sessionStorage.getItem("userType") ||
      0
  );

  const startDate = formatDate(dateRange.from);
  const endDate = formatDate(dateRange.to);

  if (!empId || !userType) {
    console.log("Invalid employee/user type:", {
      empId,
      userType,
    });

    return;
  }

  console.log("FETCH TASKS:", {
    empId,
    userType,
    startDate,
    endDate,
    searchText: debouncedSearch,
    currentPage,
  });

  dispatch(
    fetchTasks({
      empId,
      userType,
      startDate,
      endDate,
      searchText: debouncedSearch,
      projectId: null,
      pageNumber: currentPage,
      pageSize: 10,
    })
  );
}, [
  dispatch,
  dateRange.from,
  dateRange.to,
  debouncedSearch,
  taskIdFromNotification,
  currentPage,
  employeeIdFromUrl,
  userTypeFromUrl,
]);

  const displayedTasks = taskIdFromNotification
  ? notificationTask
    ? [notificationTask]
    : []
  : tasks;

  console.log("========== NOTIFICATION DEBUG ==========");
console.log("TASK ID FROM URL:", taskIdFromNotification);
console.log("TOTAL API TASKS:", tasks.length);
console.log("API TASK IDS:", tasks.map((task) => task.id));
console.log("DISPLAYED TASKS:", displayedTasks);
console.log("========================================");

  if (
  loading ||
  (taskIdFromNotification &&
    selectedTaskLoading)
) {
  return (
    <div className="p-6 text-center text-gray-500">
      Loading task...
    </div>
  );
}

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load tasks.

        <p className="mt-1 text-sm">
          {error}
        </p>
      </div>
    );
  }

  return (
    <TaskList
  tasks={displayedTasks}

  totalCount={totalCount}
  totalPages={totalPages}
  pageSize={pageSize}

  currentPage={currentPage}
  setCurrentPage={setCurrentPage}

  dateRange={dateRange}
  setDateRange={setDateRange}

  search={search}
  setSearch={setSearch}
/>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading...</div>}>
      <TasksPageInner />
    </Suspense>
  );
}
