"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { fetchTaskById } from "@/store/slices/taskSlice";
import axiosClient from "@/services/axiosClient";

import CostCards from "./components/CostCards";
import TaskForm from "./components/TaskForm";
import HoursAllocation from "./components/HoursAllocation";

function CreateTaskPageInner() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // =====================================================
  // TASK ID
  // =====================================================

  const taskIdFromUrl = Number(
    searchParams.get("taskId") || 0
  );

  const projectIdFromUrl = Number(
  searchParams.get("projectId") || 0
);

const projectTitleFromUrl =
  searchParams.get("projectTitle") || "";

console.log(
  "PROJECT TITLE FROM URL:",
  projectTitleFromUrl
);

console.log("PROJECT ID FROM URL:", projectIdFromUrl);

  const isUpdate = taskIdFromUrl > 0;

  // =====================================================
  // REDUX
  // =====================================================

 const {
  taskDetails,
  taskDetailsLoading,
  taskDetailsError,

  selectedTask,
  selectedTaskLoading,
  selectedTaskError,

  employeeNames,
} = useSelector((state) => state.task);

const currentTaskDetails =
  taskDetails || selectedTask;

  // =====================================================
  // STATE
  // =====================================================

  const [showHours, setShowHours] = useState(false);

  const [formData, setFormData] = useState({
    taskId: 0,

    taskName: "",
    taskDescription: "",

    priority: "",

    client: "",
    clientId: 0,

    project: projectTitleFromUrl,
projectId: projectIdFromUrl,
projectCode: "",

    startDate: "",
    endDate: "",

    status: "",
    statusId: 0,

    templateId: 0,

    resources: [],
  });

  // =====================================================
  // FETCH TASK FOR UPDATE
  // =====================================================

  useEffect(() => {
    if (!isUpdate || !taskIdFromUrl) {
      return;
    }

    console.log(
      "================================="
    );

    console.log(
      "UPDATE MODE"
    );

    console.log(
      "FETCHING TASK:",
      taskIdFromUrl
    );

    console.log(
      "================================="
    );

    dispatch(
      fetchTaskById(taskIdFromUrl)
    );
  }, [
    dispatch,
    isUpdate,
    taskIdFromUrl,
  ]);

  // =====================================================
  // DEBUG TASK RESPONSE
  // =====================================================

  useEffect(() => {
    if (!taskDetails) {
      return;
    }

    console.log(
      "================================="
    );

    console.log(
      "TASK DETAILS RESPONSE"
    );

    console.log(
      taskDetails
    );

    console.log(
      "EMPLOYEE ALLOCATIONS:",
      taskDetails.employeeAllocations
    );

    console.log(
      "================================="
    );
  }, [taskDetails]);

  // =====================================================
  // POPULATE TASK FORM
  // =====================================================

useEffect(() => {
  // IMPORTANT:
  // Only populate existing task details in UPDATE mode
  if (!isUpdate || !taskDetails) {
    return;
  }

  console.log(
    "POPULATING UPDATE FORM:",
    taskDetails
  );

  // =====================================================
  // CONVERT API DATE
  // API: 07/21/2026
  // FORM: 2026-07-21
  // =====================================================

  const normalizeDate = (value) => {
    if (!value) {
      return "";
    }

    // Already yyyy-MM-dd
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return value;
    }

    // API format: MM/dd/yyyy
    if (
      /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    ) {
      const [month, day, year] =
        value.split("/");

      return `${year}-${month}-${day}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // EMPLOYEE RESOURCES
  // =====================================================

  const resources = (
    taskDetails.employeeAllocations ||
    []
  ).map((employee) => {
    const employeeId = Number(
      employee.employeeId
    );

    const employeeFromList =
      employeeNames?.find(
        (item) =>
          Number(
            item.employeeId
          ) === employeeId
      );

    return {
      employeeId,

      employeeName:
        employee.employeeName ||
        employee.employee_Name ||
        employee.name ||
        employeeFromList?.employeeName ||
        "",
    };
  });

  console.log(
    "UPDATE RESOURCES:",
    resources
  );

  // =====================================================
  // FORM DATA
  // =====================================================

  setFormData((prev) => ({
    ...prev,

    taskId:
      Number(
        taskDetails.taskId
      ) ||
      taskIdFromUrl ||
      0,

    taskName:
      taskDetails.taskTitle ||
      "",

    taskDescription:
      taskDetails.taskDescription ||
      "",

    priority:
      taskDetails.taskPriority ||
      taskDetails.priority ||
      "",

    startDate:
      normalizeDate(
        taskDetails.startDate
      ),

    endDate:
      normalizeDate(
        taskDetails.endDate
      ),

    projectId:
      Number(
        taskDetails.projectId
      ) || 0,

    projectCode:
      taskDetails.projectCode ||
      "",

    clientId:
      Number(
        taskDetails.clientId
      ) || 0,

    statusId:
      Number(
        taskDetails.statusId
      ) || 0,

    status:
      taskDetails.statusName ||
      taskDetails.status ||
      "",

    templateId:
      Number(
        taskDetails.templateId
      ) || 0,

    resources,
  }));

  console.log(
  "FORM DATA AFTER TASK POPULATION:",
  {
    taskName:
      taskDetails.taskTitle,

    taskId:
      taskDetails.taskId,

    priority:
      taskDetails.taskPriority,

    startDate:
      taskDetails.startDate,

    endDate:
      taskDetails.endDate,

    projectId:
      taskDetails.projectId,

    clientId:
      taskDetails.clientId,

    status:
      taskDetails.status,

    employeeAllocations:
      taskDetails.employeeAllocations,
  }
);

  // Automatically open hours
  setShowHours(true);

}, [
  isUpdate,
  taskDetails,
  taskIdFromUrl,
  employeeNames,
]);

// =====================================================
// RESET FORM FOR CREATE MODE
// =====================================================

useEffect(() => {
  if (isUpdate) {
    return;
  }

  console.log("CREATE MODE - RESETTING FORM");

  setShowHours(false);

  setFormData({
    taskId: 0,

    taskName: "",
    taskDescription: "",

    priority: "",

    client: "",
    clientId: 0,

    project: projectTitleFromUrl || "",
    projectId: projectIdFromUrl,
    projectCode: "",

    startDate: "",
    endDate: "",

    status: "",
    statusId: 0,

    templateId: 0,

    resources: [],
  });
}, [
  isUpdate,
  projectIdFromUrl,
  projectTitleFromUrl,
]);

  // =====================================================
// LOAD PROJECT + CLIENT NAME
// =====================================================

useEffect(() => {
  // -----------------------------------------------------
  // UPDATE MODE
  // Get project ID from existing task
  // -----------------------------------------------------
  const projectId = isUpdate
    ? Number(taskDetails?.projectId || 0)
    : projectIdFromUrl;

  console.log("=================================");
  console.log("LOADING PROJECT/CLIENT DATA");
  console.log("IS UPDATE:", isUpdate);
  console.log("PROJECT ID FROM URL:", projectIdFromUrl);
  console.log("TASK PROJECT ID:", taskDetails?.projectId);
  console.log("FINAL PROJECT ID:", projectId);
  console.log("=================================");

  if (!projectId) {
    console.log("NO PROJECT ID - SKIPPING FORM DATA");
    return;
  }

  const loadTaskFormData = async () => {
    try {
      const response = await axiosClient.get(
        "/Task/form-data",
        {
          params: {
            projectId: projectId,
            templateId: isUpdate
              ? Number(taskDetails?.templateId || 0)
              : 0,
          },
        }
      );

      const data = response.data;

      console.log(
        "TASK FORM DATA RESPONSE:",
        data
      );

      // =====================================================
      // FIND PROJECT
      // =====================================================

      const projectList =
        data?.projects ||
        data?.projectList ||
        [];

      const selectedProject =
        projectList.find(
          (project) =>
            Number(
              project.projectId ??
              project.project_ID ??
              project.id
            ) === projectId
        );

      console.log(
        "SELECTED PROJECT:",
        selectedProject
      );

      // =====================================================
      // PROJECT NAME
      // =====================================================

      const projectName =
        data?.projectName ||
        data?.projectTitle ||
        selectedProject?.projectName ||
        selectedProject?.projectTitle ||
        selectedProject?.project_Title ||
        selectedProject?.name ||
        selectedProject?.title ||
        taskDetails?.projectTitle ||
        "";

      // =====================================================
      // CLIENT
      // =====================================================

      const clientName =
        data?.clientName ||
        data?.clientTitle ||
        taskDetails?.clientName ||
        "";

      const clientId =
        Number(
          data?.clientId ||
          taskDetails?.clientId ||
          0
        );

      // =====================================================
      // SET FORM DATA
      // =====================================================

      setFormData((prev) => ({
        ...prev,

        project: projectName,

        projectId: projectId,

        client: clientName,

        clientId: clientId,
      }));

      console.log(
        "FINAL PROJECT NAME:",
        projectName
      );

      console.log(
        "FINAL CLIENT NAME:",
        clientName
      );

    } catch (error) {
      console.error(
        "TASK FORM DATA ERROR:",
        error?.response?.data ||
        error?.message ||
        error
      );
    }
  };

  loadTaskFormData();

}, [
  isUpdate,
  projectIdFromUrl,
  taskDetails,
]);

  // =====================================================
  // ADD HOURS
  // =====================================================

  const handleAddHours = () => {
    const requiredFields = [
      "taskName",
      "priority",
      "startDate",
      "endDate",
      "status",
    ];

    const emptyFields =
      requiredFields.filter(
        (field) =>
          !formData[field] ||
          formData[field]
            .toString()
            .trim() === ""
      );

    if (
      emptyFields.length > 0
    ) {
      alert(
        `Missing fields: ${emptyFields.join(
          ", "
        )}`
      );

      return;
    }

    setShowHours(
      (prev) => !prev
    );
  };

 // =====================================================
// LOADING
// =====================================================

if (
  isUpdate &&
  !currentTaskDetails &&
  (taskDetailsLoading ||
    selectedTaskLoading)
) {
  return (
    <div className="p-6 text-center">
      Loading task details...
    </div>
  );
}

  /// =====================================================
// ERROR
// =====================================================

if (
  isUpdate &&
  !currentTaskDetails &&
  (taskDetailsError ||
    selectedTaskError)
) {
  return (
    <div className="p-6 text-center text-red-500">
      {taskDetailsError ||
        selectedTaskError}
    </div>
  );
}

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
      {/* =================================================
          COST CARDS
      ================================================= */}

      <CostCards />

      {/* =================================================
          TASK FORM
      ================================================= */}

      <div className="px-4 sm:px-6">
        <TaskForm
          formData={formData}
          setFormData={setFormData}
          isUpdate={isUpdate}
        />
      </div>

      {/* =================================================
          ADD / HIDE HOURS BUTTON
      ================================================= */}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleAddHours}
          className="
            mb-4
            rounded-lg
            bg-[#E12729]
            px-3
            py-2
            text-white
            hover:bg-red-700
          "
        >
          {showHours
            ? "Hide Hours"
            : "Click to Add Hours"}
        </button>
      </div>

      {/* =================================================
          HOURS ALLOCATION
      ================================================= */}

      <div className="mt-4 px-4 sm:px-6">
        {showHours && (
          <HoursAllocation
            formData={formData}
            taskId={formData.taskId}
            setFormData={setFormData}
            taskDetails={currentTaskDetails}
            isUpdate={isUpdate}
          />
        )}
      </div>
    </>
  );
}

export default function CreateTaskPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading...</div>}>
      <CreateTaskPageInner />
    </Suspense>
  );
}
