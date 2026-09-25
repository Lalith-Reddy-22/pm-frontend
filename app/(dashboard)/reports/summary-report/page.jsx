"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import ReportToolbar from "./components/ReportToolbar";
import ReportTable from "./components/ReportTable";
import EmployeeToolbar from "./components/EmployeeToolbar";
import EmployeeTable from "./components/EmployeeTable";
import DataPagination from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectsDropdown,
  fetchTaskList,
  fetchProjectList,
  fetchProjectTaskDetails,
} from "@/store/slices/summaryReportSlice";
import {
  getTaskAllocationReport,
} from "@/services/taskAllocationReportService";

import {
  getEmployeeList,
} from "@/services/employeeListService";

import { exportFile } from "@/store/slices/exportSlice";
import EmployeeTaskModal from "./components/EmployeeTaskModal";
import ProjectTable from "./components/ProjectTable";
import ProjectDetailsModal from "./components/ProjectDetailsModal";
import { REPORT_EXPORT_COLUMNS } from "./components/columns";


const getEmpIdFromToken = () => {
  try {
    const storedEmpId = sessionStorage.getItem("empId");
    if (storedEmpId) return storedEmpId;

    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      return null;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    return (
      payload.empId ||
      payload.EmpId ||
      payload.emp_id ||
      payload.employeeId ||
      payload.employee_ID ||
      null
    );
  } catch (error) {
    console.error("Error reading empId from token:", error);
    return null;
  }
};

export default function SummaryReportPage() {

  const dispatch = useDispatch();

const {
  projects: reduxProjects,
  projectsLoading,
  projectsError,

  projectList,
  projectListLoading,
  projectListTotal,
  projectListTotalPages,

  projectTaskDetails,
  projectTaskDetailsLoading,
  projectTaskDetailsError,

  employeeTaskDetails,
  employeeTaskDetailsLoading,
  employeeTaskDetailsError,
  employeeTaskDetailsTotal,
  employeeTaskDetailsTotalPages,

  taskData,
  taskTotalRecords,
  taskPageNumber,
  taskPageSize,
  taskTotalPages,
  taskLoading,
  taskError,
} = useSelector((state) => state.summaryReport);

const projectRows = projectList || [];

const projects = reduxProjects || [];

useEffect(() => {
  console.log("FETCHING PROJECTS...");
  dispatch(fetchProjectsDropdown());
}, [dispatch]);

const handleViewProject = (project) => {
  console.log("========== VIEW PROJECT ==========");
  console.log("PROJECT:", project);
  console.log("PROJECT ID:", project.project_ID);
  console.log("PROJECT CODE:", project.projectCode);

  setSelectedProjectDetails(project);
  setProjectModalOpen(true);

  dispatch(
    fetchProjectTaskDetails({
      projectId: Number(project.project_ID),
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    })
  );
};

  const [empId, setEmpId] = useState(null);
  // Tab state
  const [activeTab, setActiveTab] = useState("task-allocation");

  // Filter state
  const [selectedProject, setSelectedProject] = useState("all");
  const [startDate, setStartDate] = useState(() => new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(() => new Date());
  const [search, setSearch] = useState("");

  const [employeeTaskModalOpen, setEmployeeTaskModalOpen] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);

  // Employee List state
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeePageSize, setEmployeePageSize] = useState(50);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [employeeIsLoading, setEmployeeIsLoading] = useState(false);

  // Project Report State
  const [projectSearch, setProjectSearch] = useState("");
const [projectPageSize, setProjectPageSize] = useState(10);
const [projectPage, setProjectPage] = useState(1);

const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
const [projectModalOpen, setProjectModalOpen] = useState(false);

  const [error, setError] = useState(null);

const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

  // usePagination hooks (server-driven — data slice comes from API, hook drives UI only)
  const reportPagination = usePagination({
    data: taskData,
    pageSize,
    totalItems: taskTotalRecords,
  });
  const employeePagination = usePagination({
    data: employeeData,
    pageSize: employeePageSize,
    totalItems: employeeTotal,
  });

  const employeeTotalPages = Math.max(
  1,
  Math.ceil(employeeTotal / employeePageSize)
);

  const projectPagination = {
  page: projectPage,
  setPage: setProjectPage,
};

  useEffect(() => {
  const token = sessionStorage.getItem("accessToken");
  const storedEmpId = sessionStorage.getItem("empId");

  if (!token && !storedEmpId) {
    console.log("ACCESS TOKEN NOT AVAILABLE");
    return;
  }

  try {
    const payload = token
      ? JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
      : {};

    const loggedEmpId = Number(
      sessionStorage.getItem("empId") ||
      payload.empId ||
      payload.EmpId ||
      payload.emp_id ||
      payload.employeeId ||
      payload.employee_ID ||
      0
    );
    const empType = Number(
      sessionStorage.getItem("userType") ||
      payload.userType ||
      payload.UserType ||
      payload.user_Type ||
      payload.user_type ||
      0
    );

    console.log("TASK API EMP ID:", loggedEmpId);
    console.log("TASK API EMP TYPE:", empType);

    if (!loggedEmpId) {
      console.log("EMP ID NOT AVAILABLE");
      return;
    }

    console.log("FETCHING TASK LIST...");

    dispatch(
      fetchTaskList({
        empId: loggedEmpId,
        empType: empType,
        startDate: startDate
          ? format(startDate, "yyyy-MM-dd")
          : "",
        endDate: endDate
          ? format(endDate, "yyyy-MM-dd")
          : "",
        projectId:
          selectedProject === "all"
            ? 0
            : Number(selectedProject),
        searchText: search,
        pageNumber: reportPagination.page,
        pageSize: pageSize,
      })
    );
  } catch (error) {
    console.error("FAILED TO READ JWT:", error);
  }
}, [
  dispatch,
  startDate,
  endDate,
  selectedProject,
  search,
  pageSize,
  reportPagination.page,
]);

  /**
   * Fetch projects for filter dropdown on mount
   */

  useEffect(() => {
  const id = getEmpIdFromToken();

  console.log("LOGGED IN EMP ID:", id);

  setEmpId(id);
}, []);

  /**
   * Fetch report data whenever filters change
   */
  useEffect(() => {
    reportPagination.setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, startDate, endDate, search]);

  useEffect(() => {
  if (activeTab !== "project") return;

  const token = sessionStorage.getItem("accessToken");
  const storedEmpId = sessionStorage.getItem("empId");

  let loggedEmpId = Number(storedEmpId || 0);
  let empType = Number(sessionStorage.getItem("userType") || 0);

  try {
    if (token) {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );

      loggedEmpId =
        loggedEmpId ||
        Number(
          payload.empId ||
          payload.EmpId ||
          payload.emp_id ||
          payload.employeeId ||
          payload.employee_ID ||
          0
        );

      empType =
        empType ||
        Number(
          payload.userType ||
          payload.UserType ||
          payload.user_Type ||
          payload.user_type ||
          0
        );
    }
  } catch (error) {
    console.error("FAILED TO READ JWT:", error);
  }

  if (!loggedEmpId) {
    console.error("PROJECT API: Employee ID not available");
    return;
  }

  dispatch(
    fetchProjectList({
      empId: loggedEmpId,
      empType,
      searchText: projectSearch,
      pageNumber: projectPage,
      pageSize: projectPageSize,
    })
  );
}, [
  activeTab,
  dispatch,
  projectPage,
  projectPageSize,
  projectSearch,
]);

  /**
   * Fetch employee list
   */
  const fetchEmployeeData = useCallback(async () => {
    try {
      setEmployeeIsLoading(true);

      const filters = {
        search: employeeSearch,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
        page: employeePagination.page,
        pageSize: employeePageSize,
      };

      const result = await getEmployeeList(filters);
      setEmployeeData(result.data);
      setEmployeeTotal(result.total);
    } catch (err) {
      console.error("Error fetching employee list:", err);
    } finally {
      setEmployeeIsLoading(false);
    }
  }, [
    employeeSearch,
    startDate,
    endDate,
    employeePagination.page,
    employeePageSize,
  ]);

  /**
   * Fetch employee data when filters change
   */
  useEffect(() => {
    employeePagination.setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeSearch]);

  /**
   * Fetch employee data whenever pagination changes
   */
  useEffect(() => {
    if (activeTab === "employee") {
      fetchEmployeeData();
    }
  }, [fetchEmployeeData, activeTab]);

  /**
   * Handle export
   */
  const handleExport = async (exportFormat) => {
  try {
    const filters = {
      empId,
      projectId:
        selectedProject === "all"
          ? 0
          : Number(selectedProject),

      startDate: startDate
        ? format(startDate, "yyyy-MM-dd")
        : null,

      endDate: endDate
        ? format(endDate, "yyyy-MM-dd")
        : null,

      search,
      sortBy: "projectCode",
      sortDirection: "asc",

      // Fetch all records for export
      page: 1,
      pageSize: 10000,
    };

    const result = await getTaskAllocationReport(filters);

    const rows = result?.data || [];

    const exportData = rows.map((row) => ({
      projectCode:
  row.projectCode ??
  row.project_Code ??
  "",

projectTitle:
  row.project_Title ??
  row.projectTitle ??
  row.Project_Title ??
  row.ProjectTitle ??
  "",

      client:
        row.client_Title ??
        row.Client_Title ??
        row.client ??
        "",

      subClient:
        row.sub_Client_Name ??
        row.Sub_Client_Name ??
        row.subClient ??
        "",

      taskId:
        row.task_ID ??
        row.Task_ID ??
        row.Task_id ??
        row.taskId ??
        "",

      taskTitle:
        row.task_Title ??
        row.Task_Title ??
        row.TaskTitle ??
        row.taskTitle ??
        "",

      type:
        Number(row.billing_type) === 0
          ? "Non-Billable"
          : "Billable",

      startDate:
        row.startDate ??
        row.StartDate ??
        "",

      endDate:
        row.endDate ??
        row.EndDate ??
        "",

      employeeName:
        row.employee_Name ??
        row.Employee_Name ??
        row.emp_Name ??
        row.Emp_Name ??
        row.employeeName ??
        "",

      designation:
        row.empDesignation ??
        row.EmpDesignation ??
        row.employee_Designation ??
        row.Employee_Designation ??
        row.employeeDesignation ??
        row.EmployeeDesignation ??
        row.designation ??
        "",

      function:
        row.teams_Name ??
        row.Teams_Name ??
        row.Function_Name ??
        row.functionName ??
        row.function ??
        "",

      plannedHours:
        row.planneHours ??
        row.plannedHours ??
        row.Planned_hours ??
        0,

      actualHours:
        row.logHours ??
        row.actualHours ??
        row.ActualHours ??
        0,

      unitCost:
        row.empValue ??
        row.unitCost ??
        row.Unit_Cost ??
        0,

      plannedCost:
        row.planned_Cost ??
        row.Planned_Cost ??
        0,

      actualCost:
        row.actual_Cost ??
        row.Actual_Cost ??
        0,

      difference:
        Number(
          row.actual_Cost ??
          row.Actual_Cost ??
          0
        ) -
        Number(
          row.planned_Cost ??
          row.Planned_Cost ??
          0
        ),
    }));

    dispatch(
      exportFile({
        fileName: `task-allocation-report-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,

        format: exportFormat,

        columns: REPORT_EXPORT_COLUMNS,

        data: exportData,
      })
    );
  } catch (err) {
    console.error("Error exporting report:", err);
    setError("Failed to export report");
  }
};

const handleSelectedPages = async (
  exportFormat,
  fromPage,
  toPage
) => {
  try {
    console.log(
      `SELECTED PAGE EXPORT: ${fromPage} → ${toPage}`
    );

    const allData = [];

    for (
      let pageNumber = fromPage;
      pageNumber <= toPage;
      pageNumber++
    ) {
      const filters = {
        empId,
        projectId:
          selectedProject === "all"
            ? 0
            : Number(selectedProject),

        startDate: startDate
          ? format(startDate, "yyyy-MM-dd")
          : null,

        endDate: endDate
          ? format(endDate, "yyyy-MM-dd")
          : null,

        search,

        sortBy: "projectCode",
        sortDirection: "asc",

        page: pageNumber,
        pageSize: pageSize,
      };

      console.log(
        `FETCHING EXPORT PAGE ${pageNumber}`,
        filters
      );

      const result =
        await getTaskAllocationReport(filters);

      const pageData = result?.data || [];

      console.log(
        `PAGE ${pageNumber} RECORDS:`,
        pageData.length
      );

      allData.push(...pageData);
    }

    console.log(
      "TOTAL SELECTED RECORDS:",
      allData.length
    );

    const exportData = allData.map((row) => ({
      projectCode:
        row.projectCode ??
        row.project_Code ??
        "",

      projectTitle:
        row.project_Title ??
        row.projectTitle ??
        row.Project_Title ??
        row.ProjectTitle ??
        "",

      client:
        row.client_Title ??
        row.Client_Title ??
        row.client ??
        "",

      subClient:
        row.sub_Client_Name ??
        row.Sub_Client_Name ??
        row.subClient ??
        "",

      taskId:
        row.task_ID ??
        row.Task_ID ??
        row.Task_id ??
        row.taskId ??
        "",

      taskTitle:
        row.task_Title ??
        row.Task_Title ??
        row.TaskTitle ??
        row.taskTitle ??
        "",

      type:
        Number(row.billing_type) === 0
          ? "Non-Billable"
          : "Billable",

      startDate:
        row.startDate ??
        row.StartDate ??
        "",

      endDate:
        row.endDate ??
        row.EndDate ??
        "",

      employeeName:
        row.employee_Name ??
        row.Employee_Name ??
        row.emp_Name ??
        row.Emp_Name ??
        row.employeeName ??
        "",

      designation:
        row.empDesignation ??
        row.EmpDesignation ??
        row.employee_Designation ??
        row.Employee_Designation ??
        row.employeeDesignation ??
        row.EmployeeDesignation ??
        row.designation ??
        "",

      function:
        row.teams_Name ??
        row.Teams_Name ??
        row.Function_Name ??
        row.functionName ??
        row.function ??
        "",

      plannedHours:
        row.planneHours ??
        row.plannedHours ??
        row.Planned_hours ??
        0,

      actualHours:
        row.logHours ??
        row.actualHours ??
        row.ActualHours ??
        0,

      unitCost:
        row.empValue ??
        row.unitCost ??
        row.Unit_Cost ??
        0,

      plannedCost:
        row.planned_Cost ??
        row.Planned_Cost ??
        0,

      actualCost:
        row.actual_Cost ??
        row.Actual_Cost ??
        0,

      difference:
        Number(
          row.actual_Cost ??
          row.Actual_Cost ??
          0
        ) -
        Number(
          row.planned_Cost ??
          row.Planned_Cost ??
          0
        ),
    }));

    await dispatch(
      exportFile({
        fileName: `task-allocation-report-pages-${fromPage}-to-${toPage}`,
        format: exportFormat,
        columns: REPORT_EXPORT_COLUMNS,
        data: exportData,
      })
    ).unwrap();

    console.log(
      `SELECTED PAGE EXPORT COMPLETED: ${fromPage} → ${toPage}`
    );
  } catch (err) {
    console.error(
      "SELECTED PAGE EXPORT ERROR:",
      err
    );

    setError("Failed to export selected pages");
  }
};

  /**
   * Handle employee list export
   */
  const handleEmployeeExport = async (exportFormat = "csv") => {
  try {
    const filters = {
  search: employeeSearch || "",
  startDate: startDate
    ? format(startDate, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd"),

  endDate: endDate
    ? format(endDate, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd"),

  page: 1,
  pageSize: 10000,
};

    console.log("EMPLOYEE EXPORT FILTERS:", filters);

    const result = await getEmployeeList(filters);

    console.log("EMPLOYEE EXPORT RESULT:", result);

    const exportData = (result?.data || []).map((employee) => ({
      name:
        employee.name ??
        employee.employee_Name ??
        employee.employeeName ??
        employee.emp_Name ??
        "",
    }));

    await dispatch(
      exportFile({
        fileName: `employee-list-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          {
            key: "name",
            header: "Employee Name",
          },
        ],
        data: exportData,
      })
    ).unwrap();
  } catch (err) {
    console.error(
      "EMPLOYEE EXPORT ERROR:",
      err.response?.data || err
    );
  }
};

const handleEmployeeSelectedPages = async (
  exportFormat,
  fromPage,
  toPage
) => {
  try {
    console.log(
      `EMPLOYEE SELECTED PAGE EXPORT: ${fromPage} → ${toPage}`
    );

    const allData = [];

    for (
      let pageNumber = fromPage;
      pageNumber <= toPage;
      pageNumber++
    ) {
      const filters = {
        search: employeeSearch || "",
        startDate: startDate
          ? format(startDate, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),

        endDate: endDate
          ? format(endDate, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),

        page: pageNumber,
        pageSize: employeePageSize,
      };

      console.log(
        `FETCHING EMPLOYEE EXPORT PAGE ${pageNumber}`,
        filters
      );

      const result = await getEmployeeList(filters);

      const pageData = result?.data || [];

      console.log(
        `EMPLOYEE PAGE ${pageNumber} RECORDS:`,
        pageData.length
      );

      allData.push(...pageData);
    }

    console.log(
      "TOTAL SELECTED EMPLOYEE RECORDS:",
      allData.length
    );

    const exportData = allData.map((employee) => ({
      name:
        employee.name ??
        employee.employee_Name ??
        employee.employeeName ??
        employee.emp_Name ??
        "",
    }));

    await dispatch(
      exportFile({
        fileName: `employee-list-pages-${fromPage}-to-${toPage}-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          {
            key: "name",
            header: "Employee Name",
          },
        ],
        data: exportData,
      })
    ).unwrap();

    console.log(
      `EMPLOYEE SELECTED PAGE EXPORT COMPLETED: ${fromPage} → ${toPage}`
    );
  } catch (err) {
    console.error(
      "EMPLOYEE SELECTED PAGE EXPORT ERROR:",
      err.response?.data || err
    );
  }
};

const handleProjectExport = async (exportFormat = "csv") => {
  try {
    // Use the project data already loaded/displayed on the page
    const exportData = (projects || []).map((project) => ({
      projectCode:
        project.projectCode ??
        project.project_Code ??
        "",
      projectTitle:
        project.projectTitle ??
        project.project_Title ??
        project.project_Title_Name ??
        "",
      client:
        project.clientName ??
        project.client_Title ??
        project.client ??
        "",
    }));

    await dispatch(
      exportFile({
        fileName: `project-list-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          {
            key: "projectCode",
            header: "Project Code",
          },
          {
            key: "projectTitle",
            header: "Project Title",
          },
          {
            key: "client",
            header: "Client",
          },
        ],
        data: exportData,
      })
    ).unwrap();
  } catch (err) {
    console.error("PROJECT EXPORT ERROR:", err);
  }
};

const handleProjectSelectedPages = async (
  exportFormat,
  fromPage,
  toPage
) => {
  try {
    console.log(
      `PROJECT SELECTED PAGE EXPORT: ${fromPage} → ${toPage}`
    );

    const allData = [];

    // Get logged-in employee details
    const token = sessionStorage.getItem("accessToken");
    const storedEmpId = sessionStorage.getItem("empId");

    let loggedEmpId = Number(storedEmpId || 0);
    let empType = Number(sessionStorage.getItem("userType") || 0);

    try {
      if (token) {
        const payload = JSON.parse(
          atob(
            token
              .split(".")[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );

        loggedEmpId =
          loggedEmpId ||
          Number(
            payload.empId ||
              payload.EmpId ||
              payload.emp_id ||
              payload.employeeId ||
              payload.employee_ID ||
              0
          );

        empType =
          empType ||
          Number(
            payload.userType ||
              payload.UserType ||
              payload.user_Type ||
              payload.user_type ||
              0
          );
      }
    } catch (error) {
      console.error("FAILED TO READ JWT:", error);
    }

    if (!loggedEmpId) {
      console.error("PROJECT EXPORT: Employee ID not available");
      return;
    }

    // Fetch each selected page
    for (
      let pageNumber = fromPage;
      pageNumber <= toPage;
      pageNumber++
    ) {
      const result = await dispatch(
        fetchProjectList({
          empId: loggedEmpId,
          empType,
          searchText: projectSearch || "",
          pageNumber,
          pageSize: projectPageSize,
        })
      ).unwrap();

      const pageData = result?.data || [];

      console.log(
        `PROJECT PAGE ${pageNumber} RECORDS:`,
        pageData.length
      );

      allData.push(...pageData);
    }

    console.log(
      "TOTAL SELECTED PROJECT RECORDS:",
      allData.length
    );

    // Map project data for export
    const exportData = allData.map((project) => ({
      projectCode:
        project.projectCode ??
        project.project_Code ??
        "",

      projectTitle:
        project.projectTitle ??
        project.project_Title ??
        project.project_Title_Name ??
        "",

      client:
        project.clientName ??
        project.client_Title ??
        project.client ??
        "",
    }));

    // Export
    await dispatch(
      exportFile({
        fileName: `project-list-pages-${fromPage}-to-${toPage}-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          {
            key: "projectCode",
            header: "Project Code",
          },
          {
            key: "projectTitle",
            header: "Project Title",
          },
          {
            key: "client",
            header: "Client",
          },
        ],
        data: exportData,
      })
    ).unwrap();

    console.log(
      `PROJECT SELECTED PAGE EXPORT COMPLETED: ${fromPage} → ${toPage}`
    );
  } catch (err) {
    console.error(
      "PROJECT SELECTED PAGE EXPORT ERROR:",
      err
    );
  }
};

  const projectTotalItems = projectListTotal || 0;

const projectTotalPages = projectListTotalPages || 1;

const projectStartIndex =
  projectTotalItems === 0
    ? 0
    : (projectPage - 1) * projectPageSize + 1;

const projectEndIndex =
  projectTotalItems === 0
    ? 0
    : Math.min(
        projectPage * projectPageSize,
        projectTotalItems
      );

const projectHasPrev = projectPage > 1;

const projectHasNext =
  projectPage < projectTotalPages;

const projectPrevPage = () => {
  if (projectHasPrev) {
    setProjectPage((prev) => prev - 1);
  }
};

const projectNextPage = () => {
  if (projectHasNext) {
    setProjectPage((prev) => prev + 1);
  }
};

const projectGoToPage = (pageNumber) => {
  if (
    pageNumber >= 1 &&
    pageNumber <= projectTotalPages
  ) {
    setProjectPage(pageNumber);
  }
};

const projectPageNumbers = [];

if (projectTotalPages <= 5) {
  for (let i = 1; i <= projectTotalPages; i++) {
    projectPageNumbers.push(i);
  }
} else {
  if (projectPage <= 3) {
    projectPageNumbers.push(1, 2, 3, "…", projectTotalPages);
  } else if (projectPage >= projectTotalPages - 2) {
    projectPageNumbers.push(
      1,
      "…",
      projectTotalPages - 2,
      projectTotalPages - 1,
      projectTotalPages
    );
  } else {
    projectPageNumbers.push(
      1,
      "…",
      projectPage,
      "…",
      projectTotalPages
    );
  }
}

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex gap-0 border-b border-border">
        <button
          onClick={() => setActiveTab("task-allocation")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "task-allocation"
              ? "bg-foreground text-background rounded-t-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Task List
        </button>
        <button
          onClick={() => setActiveTab("employee")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "employee"
              ? "bg-foreground text-background rounded-t-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Employee List
        </button>
        <button
          onClick={() => setActiveTab("project")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "project"
              ? "bg-foreground text-background rounded-t-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All Project List
        </button>
      </div>
      {error && activeTab === "task-allocation" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {activeTab === "task-allocation" && (
        <>
          <div className="overflow-visible rounded-xl border border-border bg-card shadow-sm">
            <ReportToolbar
  projects={projects}
  selectedProject={selectedProject}
  setSelectedProject={setSelectedProject}
  startDate={startDate}
  endDate={endDate}
  setDateRange={(s, e) => {
    setStartDate(s);
    setEndDate(e);
  }}
  search={search}
  setSearch={setSearch}
  pageSize={pageSize}
  setPageSize={setPageSize}
  setPage={reportPagination.setPage}
  onExport={handleExport}
  handleSelectedPages={handleSelectedPages}
  totalPages={taskTotalPages}
/>
          </div>

          {/* Table & Pagination Card */}
          <div className="overflow-visible rounded-xl border border-border bg-card shadow-sm">
            <ReportTable
  rows={taskData}
  isLoading={taskLoading}
  emptyMessage={
    search || selectedProject !== "all"
      ? "No records match your filters"
      : "No records available"
  }
/>

            {/* Pagination */}
            {taskTotalRecords > 0 && (
              <DataPagination {...reportPagination} />
            )}
          </div>

          {/* Summary Stats */}
          {/* {taskData.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Records
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">{taskTotalRecords}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Planned Cost
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${taskData
                    .reduce((sum, item) => sum + item.plannedCost, 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Actual Cost
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${taskData
                    .reduce((sum, item) => sum + item.actualCost, 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Difference
                </p>
                <p className={`mt-1 text-2xl font-bold ${
                  taskData.reduce((sum, item) => sum + item.difference, 0) > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}>
                  {taskData.reduce((sum, item) => sum + item.difference, 0) > 0 ? "+" : ""}
                  ${Math.abs(taskData.reduce((sum, item) => sum + item.difference, 0)).toLocaleString()}
                </p>
              </div>
            </div>
          )} */}
        </>
      )}

      {/* Employee Report Tab Content */}
      {activeTab === "employee" && (
        <>
          {/* Employee Toolbar Card */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <EmployeeToolbar
  search={employeeSearch}
  setSearch={setEmployeeSearch}
  pageSize={employeePageSize}
  setPageSize={setEmployeePageSize}
  setPage={employeePagination.setPage}
  onExport={handleEmployeeExport}
  handleSelectedPages={handleEmployeeSelectedPages}
  totalPages={employeeTotalPages}
/>
          </div>

          {/* Employee Table Card */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
  <EmployeeTable
  rows={employeeData}
  isLoading={employeeIsLoading}
  onViewEmployee={(employee) => {
    console.log("SELECTED EMPLOYEE:", employee);

    setSelectedEmployee(employee);
    setEmployeeTaskModalOpen(true);
  }}
/>

  {employeeData.length > 0 && (
    <DataPagination {...employeePagination} />
  )}

  <EmployeeTaskModal
  open={employeeTaskModalOpen}
  onOpenChange={setEmployeeTaskModalOpen}
  employee={selectedEmployee}
  startDate={startDate}
  endDate={endDate}
/>
</div>
        </>
      )}

      {/* Project Report Tab Content */}
{activeTab === "project" && (
  <>
    {/* Toolbar */}
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <EmployeeToolbar
  search={projectSearch}
  setSearch={setProjectSearch}
  pageSize={projectPageSize}
  setPageSize={setProjectPageSize}
  setPage={projectPagination.setPage}
  searchPlaceholder="Search projects..."
  onExport={handleProjectExport}
  handleSelectedPages={handleProjectSelectedPages}
  totalPages={projectTotalPages}
/>
    </div>

    {/* Table */}
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <ProjectTable
  rows={projectList || []}
  isLoading={projectListLoading}
  emptyMessage="No projects found"
  onViewProject={handleViewProject}
/>
      {projectListTotal > 0 && (
  <DataPagination
    page={projectPage}
    totalPages={projectTotalPages}
    totalItems={projectTotalItems}
    startIndex={projectStartIndex}
    endIndex={projectEndIndex}
    hasPrev={projectHasPrev}
    hasNext={projectHasNext}
    prevPage={projectPrevPage}
    nextPage={projectNextPage}
    goToPage={projectGoToPage}
    pageNumbers={projectPageNumbers}
  />
)}
    </div>

    <ProjectDetailsModal
  open={projectModalOpen}
  onClose={() => setProjectModalOpen(false)}
  project={selectedProjectDetails}
  tasks={projectTaskDetails}
  loading={projectTaskDetailsLoading}
/>
  </>
)}
    </div>
  );
}
