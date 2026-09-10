"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
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
  showBackButton = false,

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
  console.log("RESCHEDULE TASK FROM TASK LIST:", task);

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
  console.log("========== RESCHEDULE SUBMIT ==========");
  console.log("TASK:", data.task);
  console.log("ORIGINAL DATE:", data.originalDate);
  console.log("RESCHEDULE DATE:", data.rescheduleDate);
  console.log("RESCHEDULE TYPE:", data.rescheduleType);
  console.log("REASON:", data.reason);

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

    console.log(
      "========== RESCHEDULE API PAYLOAD =========="
    );
    console.log(payload);

    const result = await dispatch(
      rescheduleTask(payload)
    ).unwrap();

    console.log(
      "========== RESCHEDULE SUCCESS =========="
    );
    console.log(result);

    // Close only after API succeeds
    handleCloseReschedule();

    alert("Task rescheduled successfully.");

  } catch (error) {
    console.error(
      "========== RESCHEDULE FAILED =========="
    );
    console.error(error);

    alert(
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
    alert("Delete reason is required.");
    return;
  }

  const deletedBy = Number(
    sessionStorage.getItem("empId") || 0
  );

  if (!deletedBy) {
    alert("Unable to identify the logged-in user.");
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

    console.log("DELETE TASK SUCCESS:", result);

    alert("Task deleted successfully.");
  } catch (error) {
    console.error("DELETE TASK FAILED:", error);

    alert(
      typeof error === "string"
        ? error
        : error?.message || "Failed to delete task."
    );
  }
}

const handleExport = async (exportFormat = "csv") => {
  try {
    const exportData = tasks.map((task) => ({
      taskTitle: task.title || "",
      projectCode: task.projectCode || "",
      projectTitle: task.projectTitle || "",
      priority: task.priority || "",
      startDate: task.startDate || "",
      endDate: task.endDate || "",
      employees: Array.isArray(task.employees)
        ? task.employees.join(", ")
        : task.employees || "",
    }));

    await dispatch(
  exportFile({
    fileName: `task-list-${format(
      new Date(),
      "yyyy-MM-dd-HHmmss"
    )}`,
    format: exportFormat,
    columns: [
      { key: "taskTitle", header: "Task Title" },
      { key: "projectCode", header: "Project Code" },
      { key: "projectTitle", header: "Project Title" },
      { key: "priority", header: "Priority" },
      { key: "startDate", header: "Start Date" },
      { key: "endDate", header: "End Date" },
      { key: "employees", header: "Employees" },
    ],
    data: exportData,
  })
).unwrap();
  } catch (error) {
    console.error("TASK EXPORT ERROR:", error);
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

    const filteredTasks = tasks;

    console.log("TASKS RECEIVED BY TASK LIST:", tasks);
console.log("FIRST TASK:", tasks?.[0]);
console.log("FIRST TASK PROJECT ID:", tasks?.[0]?.projectId);
console.log("FIRST TASK PROJECT_ID:", tasks?.[0]?.project_ID);

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
  dateRange={dateRange}
  setDateRange={setDateRange}
  onAddTask={() => setOpenDrawer(true)}
  onExport={handleExport}
/>

      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

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
  {Array.from(
    { length: Math.min(totalPages, 3) },
    (_, index) => {
      const page = index + 1;

      return (
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
  )}

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