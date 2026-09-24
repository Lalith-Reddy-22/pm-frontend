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



  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), 0, 1),
      to: new Date(now.getFullYear(), 11, 31),
    };
  });

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

const resolveEmployeeDisplayNames = (task) => {
  // --------------------------------------------------
  // EMPLOYEE MASTER MAP
  // --------------------------------------------------
  const employeeNameMap = new Map(
    (employeeNames || [])
      .map((employee) => {
        const id =
          employee?.employeeId ??
          employee?.empId ??
          employee?.employee_Id ??
          employee?.emp_ID ??
          employee?.id;

        const name =
          employee?.employeeName ??
          employee?.employee_Name ??
          employee?.name ??
          employee?.fullName;

        if (id == null || !name) return null;

        return [
          String(id).trim(),
          String(name).trim(),
        ];
      })
      .filter(Boolean)
  );

  // --------------------------------------------------
  // HELPER
  // --------------------------------------------------
  const resolveId = (id) => {
    if (id == null || id === "") return "";

    const key = String(id).trim();

    return (
      employeeNameMap.get(key) ||
      employeeNameMap.get(String(Number(key))) ||
      ""
    );
  };

  // --------------------------------------------------
  // COLLECT EMPLOYEE IDS / NAMES
  // --------------------------------------------------
  const values = [];

  // 1. employees
  if (Array.isArray(task?.employees)) {
    values.push(...task.employees);
  } else if (typeof task?.employees === "string") {
    values.push(...task.employees.split(","));
  }

  // 2. empIds
  if (task?.empIds) {
    values.push(...String(task.empIds).split(","));
  }

  // 3. employeeIds
  if (task?.employeeIds) {
    values.push(...String(task.employeeIds).split(","));
  }

  // 4. employeeId
  if (task?.employeeId != null) {
    values.push(task.employeeId);
  }

  // 5. empId
  if (task?.empId != null) {
    values.push(task.empId);
  }

  // 6. employee_Id
  if (task?.employee_Id != null) {
    values.push(task.employee_Id);
  }

  // 7. emp_ID
  if (task?.emp_ID != null) {
    values.push(task.emp_ID);
  }

  // 8. assignedEmployeeId
  if (task?.assignedEmployeeId != null) {
    values.push(task.assignedEmployeeId);
  }

  // 9. assignedEmployeeIds
  if (task?.assignedEmployeeIds) {
    values.push(
      ...String(task.assignedEmployeeIds).split(",")
    );
  }

  // --------------------------------------------------
  // EMPLOYEE ALLOCATIONS
  // --------------------------------------------------
  if (Array.isArray(task?.employeeAllocations)) {
    task.employeeAllocations.forEach((entry) => {
      const name =
        entry?.employeeName ??
        entry?.employee_Name ??
        entry?.name ??
        entry?.fullName;

      if (name) {
        values.push(name);
        return;
      }

      const id =
        entry?.employeeId ??
        entry?.empId ??
        entry?.employee_Id ??
        entry?.emp_ID;

      if (id != null) {
        values.push(id);
      }
    });
  }

  // --------------------------------------------------
  // RESOLVE IDS → NAMES
  // --------------------------------------------------
  const resolvedNames = values
    .flatMap((value) => {
      if (value == null || value === "") {
        return [];
      }

      // Object
      if (typeof value === "object") {
        const name =
          value?.employeeName ??
          value?.employee_Name ??
          value?.name ??
          value?.fullName;

        if (name) {
          return [String(name).trim()];
        }

        const id =
          value?.employeeId ??
          value?.empId ??
          value?.employee_Id ??
          value?.emp_ID ??
          value?.id;

        const resolved = resolveId(id);

        return resolved ? [resolved] : [];
      }

      const valueString = String(value).trim();

      if (!valueString) {
        return [];
      }

      // If API already returned a name
      if (isNaN(Number(valueString))) {
        return [valueString];
      }

      // If API returned employee ID
      const resolved = resolveId(valueString);

      return resolved ? [resolved] : [];
    })
    .filter(Boolean);

  // --------------------------------------------------
  // REMOVE DUPLICATES
  // --------------------------------------------------
  return [...new Set(resolvedNames)];
};



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
  dispatch(fetchEmployeeNames());
}, [dispatch]);

const employeeNameMap = Object.fromEntries(
  (employeeNames || [])
    .map((employee) => {
      const id =
        employee?.employeeId ??
        employee?.empId ??
        employee?.employee_Id ??
        employee?.emp_ID ??
        employee?.id;

      const name =
        employee?.employeeName ??
        employee?.employee_Name ??
        employee?.name ??
        employee?.fullName;

      if (id == null || !name) return null;

      return [
        String(id).trim(),
        String(name).trim(),
      ];
    })
    .filter(Boolean)
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

  const normalizedSearch = search.trim().length > 1 ? search.trim().toLowerCase() : "";

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
    return;
  }

  dispatch(
    fetchTasks({
      empId,
      userType,
      startDate,
      endDate,
      searchText: normalizedSearch,
      projectId: null,
      pageNumber: currentPage,
      pageSize: 10,
    })
  );
}, [
  dispatch,
  dateRange.from,
  dateRange.to,
  normalizedSearch,
  taskIdFromNotification,
  currentPage,
  employeeIdFromUrl,
  userTypeFromUrl,
]);

 const mappedTasks = (tasks || []).map((task) => {
  console.log(
    "ACTUAL TASK DATA:",
    JSON.stringify(task, null, 2)
  );

  const resolvedEmployees =
    resolveEmployeeDisplayNames(task);

  return {
    ...task,
    employees: resolvedEmployees,
  };
});
  const displayedTasks = taskIdFromNotification
  ? notificationTask
    ? [{ ...notificationTask, employees: resolveEmployeeDisplayNames(notificationTask) }]
    : []
  : mappedTasks.filter((task) => {
      if (!normalizedSearch) return true;

      const employeeNames = Array.isArray(task.employees)
        ? task.employees
        : typeof task.employees === "string"
          ? task.employees.split(",")
          : [];

      const searchableText = [
        task.id,
        task.taskId,
        task.task_Id,
        task.TaskId,
        task.Task_ID,
        task.title,
        task.projectTitle,
        task.projectCode,
        ...employeeNames,
      ]
        .filter((value) => value !== null && value !== undefined && value !== "")
        .map((value) => String(value).toLowerCase())
        .join(" ");

      return searchableText.includes(normalizedSearch);
    });

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
  employeeNames={employeeNames}
  loading={loading && !taskIdFromNotification}

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
