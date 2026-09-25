"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { getTasks } from "@/services/taskService";
import {
  rescheduleTask,
  deleteTask,
} from "@/store/slices/taskSlice";
import RescheduleModal from "./components/RescheduleModal";
import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import AddTaskDrawer from "./components/AddTaskDrawer";
import { exportFile } from "@/store/slices/exportSlice";

export default function TaskList({
  tasks = [],
  employeeNames = [],
  showBackButton = false,
  loading = false,

  // API pagination
  totalCount = 0,
  totalPages = 1,
  pageSize = 10,
  currentPage = 1,
  setCurrentPage,

  // Search / date filters
  search: externalSearch,
  setSearch: externalSetSearch,
  dateRange: externalDateRange,
  setDateRange: externalSetDateRange,
}) {
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  const [rescheduleModal, setRescheduleModal] = useState({
  open: false,
  task: null,
});

const [originalDate, setOriginalDate] = useState("");
const [rescheduleDate, setRescheduleDate] = useState("");
const [rescheduleType, setRescheduleType] =
  useState("FULL_TASK");
const [rescheduleReason, setRescheduleReason] =
  useState("");
const [rescheduleLoading, setRescheduleLoading] =
  useState(false);

  function handleReschedule(task) {
  setRescheduleModal({
    open: true,
    task,
  });

  setOriginalDate("");
  setRescheduleDate("");
  setRescheduleType("FULL_TASK");
  setRescheduleReason("");
}

function handleCloseReschedule() {
  setRescheduleModal({
    open: false,
    task: null,
  });

  setOriginalDate("");
  setRescheduleDate("");
  setRescheduleType("FULL_TASK");
  setRescheduleReason("");
}

async function handleSubmitReschedule(data) {
  setRescheduleLoading(true);

  try {
    const createdBy = Number(
      sessionStorage.getItem("empId") || 0
    );

    const employeeId = Number(
      String(data.task.empIds || "")
        .split(",")[0]
        .trim()
    );

    const payload = {
      taskId: Number(data.task.id),
      employeeId: employeeId,

      // Send exactly the selected date
      originalDate: `${data.originalDate}T00:00:00`,
      rescheduleDate: `${data.rescheduleDate}T00:00:00`,

      rescheduleType: data.rescheduleType,
      reason: data.reason || "",
      createdBy: createdBy,
    };

    const result = await dispatch(
      rescheduleTask(payload)
    ).unwrap();

    // Close only after API succeeds
    handleCloseReschedule();

    toast.success("Task rescheduled successfully.");

  } catch (error) {
    toast.error(
      typeof error === "string"
        ? error
        : error?.message ||
          "Failed to reschedule task."
    );

  } finally {
    setRescheduleLoading(false);
  }
}

async function handleDeleteTask(task) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) {
    return;
  }

  const deleteReason = window.prompt(
    "Please enter the reason for deleting this task:"
  );

  if (deleteReason === null) {
    return;
  }

  if (!deleteReason.trim()) {
    toast.error("Delete reason is required.");
    return;
  }

  const deletedBy = Number(
    sessionStorage.getItem("empId") || 0
  );

  if (!deletedBy) {
    toast.error("Unable to identify the logged-in user.");
    return;
  }

  try {
    const result = await dispatch(
      deleteTask({
        taskId: Number(task.id),
        deletedBy,
        deleteReason: deleteReason.trim(),
      })
    ).unwrap();

    toast.success("Task deleted successfully.");
  } catch (error) {
    toast.error(
      typeof error === "string"
        ? error
        : error?.message || "Failed to delete task."
    );
  }
}

const handleFullData = async (exportFormat = "csv") => {
  try {

    console.log("===== TASK FULL EXPORT START =====");
    console.log("Search:", search);
    console.log("Format:", exportFormat);

    const empId = Number(
      sessionStorage.getItem("empId") || 0
    );

    const userType = Number(
      sessionStorage.getItem("userType") || 0
    );

    if (!empId || !userType) {
      toast.error("Unable to identify the logged-in user.");
      return;
    }

    const startDate = dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : "";

    const endDate = dateRange?.to
      ? format(dateRange.to, "yyyy-MM-dd")
      : "";

    // First request only to get total count
    const firstResponse = await getTasks({
      empId,
      userType,
      startDate,
      endDate,
      searchText: search.trim(),
      projectId: null,
      pageNumber: 1,
      pageSize: 100,
    });

    const firstRecords =
      Array.isArray(firstResponse)
        ? firstResponse
        : firstResponse?.tasks ||
          firstResponse?.items ||
          firstResponse?.data ||
          [];

    const totalRecords =
      firstResponse?.totalCount ||
      firstResponse?.totalRecords ||
      firstRecords.length;

    const totalPages = Math.ceil(totalRecords / 100);

    console.log("TOTAL TASKS:", totalRecords);
    console.log("TOTAL PAGES:", totalPages);

    // Collect all pages
    const allTasks = [...firstRecords];

    for (let page = 2; page <= totalPages; page++) {
      console.log(`Fetching task page ${page}/${totalPages}`);

      const response = await getTasks({
        empId,
        userType,
        startDate,
        endDate,
        searchText: search.trim(),
        projectId: null,
        pageNumber: page,
        pageSize: 100,
      });

      const pageTasks =
        Array.isArray(response)
          ? response
          : response?.tasks ||
            response?.items ||
            response?.data ||
            [];

      allTasks.push(...pageTasks);
    }

    console.log(
      "TOTAL TASKS COLLECTED:",
      allTasks.length
    );

    const exportData = allTasks.map((task) => {
      const employees =
        resolveEmployeeDisplayNames(task);

      return {
        taskTitle:
          task.title ||
          task.task_Title ||
          task.taskTitle ||
          "",

        projectCode:
          task.projectCode ||
          task.ProjectCode ||
          task.project_Code ||
          "",

        projectTitle:
          task.projectTitle ||
          task.project_Title ||
          task.projectName ||
          "",

        priority:
          task.priority ||
          task.tskpriority ||
          task.taskPriority ||
          "",

        startDate:
          task.startDate ||
          task.start_Date_Formatted ||
          task.StartDate ||
          "",

        endDate:
          task.endDate ||
          task.end_Date_Formatted ||
          task.EndDate ||
          "",

        employees: employees.join(", "),
      };
    });

    console.log(
      "FINAL TASK EXPORT COUNT:",
      exportData.length
    );

    await dispatch(
      exportFile({
        fileName: `task-list-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,

        format: exportFormat,

        columns: [
          {
            key: "taskTitle",
            header: "Task Title",
          },
          {
            key: "projectCode",
            header: "Project Code",
          },
          {
            key: "projectTitle",
            header: "Project Title",
          },
          {
            key: "priority",
            header: "Priority",
          },
          {
            key: "startDate",
            header: "Start Date",
          },
          {
            key: "endDate",
            header: "End Date",
          },
          {
            key: "employees",
            header: "Employees",
          },
        ],

        data: exportData,
      })
    ).unwrap();

    toast.success(
      `Exported ${exportData.length} tasks successfully.`
    );

    console.log(
      "===== TASK FULL EXPORT SUCCESS ====="
    );

  } catch (error) {
    console.error(
      "===== TASK FULL EXPORT ERROR ====="
    );

    console.error("Message:", error?.message);
    console.error(
      "Response:",
      error?.response?.data
    );

    toast.error(
      error?.message ||
      "Task export failed."
    );
    } finally {
    console.log("===== TASK FULL EXPORT END =====");
  }
};

const handleSelectedPages = async (
exportFormat,
fromPage,
toPage
) => {
try {
const empId = Number(
sessionStorage.getItem("empId") || 0
);


const userType = Number(
  sessionStorage.getItem("userType") || 0
);

if (!empId || !userType) {
  toast.error("Unable to identify the logged-in user.");
  return;
}

const startDate = dateRange?.from
  ? format(dateRange.from, "yyyy-MM-dd")
  : "";

const endDate = dateRange?.to
  ? format(dateRange.to, "yyyy-MM-dd")
  : "";

const searchText = search?.trim() || "";

// =====================================================
// FETCH ALL RECORDS REQUIRED FOR SELECTED PAGES
// =====================================================

const recordsPerPage = Number(pageSize) || 10;

// Example:
// Page 1-20 with pageSize 10 = 200 records
// Page 1-50 with pageSize 10 = 500 records
const lastRecordNeeded = toPage * recordsPerPage;

console.log("===== TASK SELECTED PAGE EXPORT =====");
console.log("From Page:", fromPage);
console.log("To Page:", toPage);
console.log("Records Per Page:", recordsPerPage);
console.log("Records Needed:", lastRecordNeeded);

const response = await getTasks({
  empId,
  userType,
  startDate,
  endDate,
  searchText,
  projectId: null,

  // IMPORTANT:
  // Fetch from page 1 only once
  pageNumber: 1,

  // Fetch enough records to cover the selected pages
  pageSize: lastRecordNeeded,
});

const fetchedTasks =
  Array.isArray(response)
    ? response
    : response?.tasks ||
      response?.items ||
      response?.data ||
      [];

console.log(
  "Total tasks received from API:",
  fetchedTasks.length
);

// =====================================================
// SELECT ONLY THE REQUESTED PAGES
// =====================================================

const startIndex =
  (fromPage - 1) * recordsPerPage;

const endIndex =
  toPage * recordsPerPage;

const selectedTasks = fetchedTasks.slice(
  startIndex,
  endIndex
);

console.log(
  `Selected tasks from page ${fromPage} to ${toPage}:`,
  selectedTasks.length
);

// =====================================================
// PREPARE EXPORT DATA
// =====================================================

const exportData = selectedTasks.map((task) => {
  const employees =
    resolveEmployeeDisplayNames(task);

  return {
    taskTitle:
      task.title ||
      task.task_Title ||
      task.taskTitle ||
      "",

    projectCode:
      task.projectCode ||
      task.ProjectCode ||
      task.project_Code ||
      "",

    projectTitle:
      task.projectTitle ||
      task.project_Title ||
      task.projectName ||
      "",

    priority:
      task.priority ||
      task.tskpriority ||
      task.taskPriority ||
      "",

    startDate:
      task.startDate ||
      task.start_Date_Formatted ||
      task.StartDate ||
      "",

    endDate:
      task.endDate ||
      task.end_Date_Formatted ||
      task.EndDate ||
      "",

    employees: employees.join(", "),
  };
});

// =====================================================
// EXPORT
// =====================================================

await dispatch(
  exportFile({
    fileName: `task-list-pages-${fromPage}-to-${toPage}-${format(
      new Date(),
      "yyyy-MM-dd-HHmmss"
    )}`,

    format: exportFormat,

    columns: [
      {
        key: "taskTitle",
        header: "Task Title",
      },
      {
        key: "projectCode",
        header: "Project Code",
      },
      {
        key: "projectTitle",
        header: "Project Title",
      },
      {
        key: "priority",
        header: "Priority",
      },
      {
        key: "startDate",
        header: "Start Date",
      },
      {
        key: "endDate",
        header: "End Date",
      },
      {
        key: "employees",
        header: "Employees",
      },
    ],

    data: exportData,
  })
).unwrap();

toast.success(
  `Exported ${exportData.length} tasks successfully.`
);


} catch (error) {
console.error(
"TASK SELECTED PAGE EXPORT ERROR:",
error
);

toast.error(
  error?.message ||
  "Task selected page export failed."
);


} finally {
console.log(
"===== TASK SELECTED PAGE EXPORT END ====="
);
}
};

  // --------------------------------------------------
  // Local state for Project-wise Task page
  // --------------------------------------------------

  const [localSearch, setLocalSearch] = useState("");
  const [localDateRange, setLocalDateRange] = useState(null);

  // If parent provides search, use it.
  // Otherwise use local search.
  const search = externalSearch ?? localSearch;

  const setSearch =
    externalSetSearch ?? setLocalSearch;

  const dateRange =
    externalDateRange ?? localDateRange;

  const setDateRange =
    externalSetDateRange ?? setLocalDateRange;

  const resolveEmployeeDisplayNames = (task) => {
    const employeeNameMap = new Map(
      (employeeNames || []).map((employee) => [
        String(
          employee?.employeeId ??
            employee?.empId ??
            employee?.employee_Id ??
            employee?.emp_ID ??
            ""
        ),
        String(
          employee?.employeeName ||
            employee?.employee_Name ||
            employee?.name ||
            ""
        ).trim(),
      ])
    );

    const rawEmployees = Array.isArray(task?.employees)
      ? task.employees
      : typeof task?.employees === "string"
        ? task.employees.split(",")
        : [];

    const fromAllocations = (task?.employeeAllocations || []).map((entry) => {
      const name =
        entry?.employeeName ||
        entry?.employee_Name ||
        entry?.name ||
        entry?.fullName ||
        "";

      if (name) return name.trim();

      const employeeId =
        entry?.employeeId ??
        entry?.empId ??
        entry?.employee_Id ??
        entry?.emp_ID;

      if (employeeId == null || employeeId === "") return "";

      return employeeNameMap.get(String(employeeId)) || String(employeeId);
    });

    const resolvedEmployees = [...rawEmployees, ...fromAllocations]
      .map((value) => {
        if (value === null || value === undefined || value === "") return "";

        if (typeof value === "object") {
          const objectName =
            value.employeeName ||
            value.employee_Name ||
            value.name ||
            value.fullName ||
            "";

          if (objectName) return String(objectName).trim();

          const employeeId =
            value.employeeId ??
            value.empId ??
            value.employee_Id ??
            value.emp_ID;

          if (employeeId == null || employeeId === "") return "";

          return employeeNameMap.get(String(employeeId)) || String(employeeId);
        }

        const trimmed = String(value).trim();
        if (!trimmed) return "";

        return (
          employeeNameMap.get(trimmed) ||
          employeeNameMap.get(String(Number(trimmed))) ||
          trimmed
        );
      })
      .filter(Boolean);

    const fromEmpIds = (task?.empIds || task?.employeeIds || task?.employee_Id || task?.emp_ID || "")
      .toString()
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const mappedEmpIds = fromEmpIds
      .map((id) => employeeNameMap.get(id) || employeeNameMap.get(String(Number(id))) || id)
      .filter(Boolean);

    return [...new Set([...resolvedEmployees, ...mappedEmpIds])];
  };

  const normalizedSearch = (search || "").trim().toLowerCase();
  const enrichedTasks = (tasks || []).map((task) => ({
    ...task,
    employees: resolveEmployeeDisplayNames(task),
  }));

  const filteredTasks = !normalizedSearch
    ? enrichedTasks
    : enrichedTasks.filter((task) => {
        const employeeNamesList = Array.isArray(task.employees)
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
          task.project_Code,
          ...employeeNamesList,
        ]
          .filter((value) => value !== null && value !== undefined && value !== "")
          .map((value) => String(value).toLowerCase())
          .join(" ");

        return searchableText.includes(normalizedSearch);
      });

console.log("TASK TOTAL PAGES:", totalPages);

  return (
    <div className="space-y-4 p-4 sm:p-6">

      {showBackButton && (
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-[#E12729] cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm">

        <TaskToolbar
  search={search}
  setSearch={setSearch}
  setPage={setCurrentPage}
  dateRange={dateRange}
  setDateRange={setDateRange}
  onAddTask={() => setOpenDrawer(true)}
  handleFullData={handleFullData}
  handleSelectedPages={handleSelectedPages}
  totalPages={totalPages}
/>

      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

  {loading ? (
    <div className="flex h-72 items-center justify-center bg-card">
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-[#E12729]" />
        Loading tasks...
      </div>
    </div>
  ) : (
    <>
      <div className="overflow-x-auto">
        <TaskTable
          rows={filteredTasks}
          onReschedule={handleReschedule}
          onDelete={handleDeleteTask}
        />
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between border-t px-4 py-3">

    {/* Showing text */}
    <p className="text-sm text-muted-foreground">
      Showing{" "}
      {totalCount === 0
        ? 0
        : (currentPage - 1) * pageSize + 1}
      {" – "}
      {Math.min(
        currentPage * pageSize,
        totalCount
      )}
      {" of "}
      {totalCount} entries
    </p>

    {/* Pagination buttons */}
    <div className="flex items-center gap-1">

  {/* FIRST PAGE */}
  <button
    type="button"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(1)}
    className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
  >
    «
  </button>

  {/* PREVIOUS PAGE */}
  <button
    type="button"
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage((page) => Math.max(1, page - 1))
    }
    className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
  >
    ‹
  </button>

  {/* PAGE NUMBERS */}
  {(() => {
    const delta = 2; // pages shown on each side of current
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    const pages = [];

    // Leading ellipsis
    if (start > 1) {
      pages.push(
        <button
          key={1}
          type="button"
          onClick={() => setCurrentPage(1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted"
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(
          <span key="start-ellipsis" className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
            …
          </span>
        );
      }
    }

    // Window of pages around current
    for (let page = start; page <= end; page++) {
      pages.push(
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm ${
            currentPage === page
              ? "border-[#E12729] bg-[#E12729] text-white"
              : "hover:bg-muted"
          }`}
        >
          {page}
        </button>
      );
    }

    // Trailing ellipsis
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
            …
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          type="button"
          onClick={() => setCurrentPage(totalPages)}
          className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  })()}

  {/* NEXT PAGE */}
  <button
    type="button"
    disabled={currentPage >= totalPages}
    onClick={() =>
      setCurrentPage((page) =>
        Math.min(totalPages, page + 1)
      )
    }
    className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
  >
    ›
  </button>

  {/* LAST PAGE */}
  <button
    type="button"
    disabled={currentPage >= totalPages}
    onClick={() => setCurrentPage(totalPages)}
    className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
  >
    »
  </button>

</div>

      </div>
    </>
  )}

</div>

      <AddTaskDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      />

      <RescheduleModal
  open={rescheduleModal.open}
  task={rescheduleModal.task}
  originalDate={originalDate}
  setOriginalDate={setOriginalDate}
  rescheduleDate={rescheduleDate}
  setRescheduleDate={setRescheduleDate}
  rescheduleType={rescheduleType}
  setRescheduleType={setRescheduleType}
  rescheduleReason={rescheduleReason}
  setRescheduleReason={setRescheduleReason}
  onClose={handleCloseReschedule}
  onSubmit={handleSubmitReschedule}
  isDark={false}
  loading={rescheduleLoading}
/>

    </div>
  );
}