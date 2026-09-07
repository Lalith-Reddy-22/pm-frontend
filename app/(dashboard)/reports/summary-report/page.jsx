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
} from "@/store/slices/summaryReportSlice";
import {
  getTaskAllocationReport,
  generateCSV,
} from "@/services/taskAllocationReportService";
import {
  getEmployeeList,
  generateEmployeeCSV,
} from "@/services/employeeListService";
import EmployeeTaskModal from "./components/EmployeeTaskModal";
import ProjectTable from "./components/ProjectTable";
import ProjectDetailsModal from "./components/ProjectDetailsModal";


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
  console.log("SELECTED PROJECT:", project);

  setSelectedProjectDetails(project);
  setProjectModalOpen(true);
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
  const handleExport = async () => {
    try {
      // Fetch all data for export without pagination
      const filters = {
        empId,
        projectId: selectedProject,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
        search,
        sortBy: "projectCode",
        sortDirection: "asc",
        page: 1,
        pageSize: 10000,
      };

      const result = await getTaskAllocationReport(filters);
      const csv = generateCSV(result.data);

      // Create and trigger download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `task-allocation-report-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting report:", err);
      setError("Failed to export report");
    }
  };

  /**
   * Handle employee list export
   */
  const handleEmployeeExport = async () => {
    try {
      // Fetch all data for export without pagination
      const filters = {
        search: employeeSearch,
        page: 1,
        pageSize: 10000,
      };

      const result = await getEmployeeList(filters);
      const csv = generateEmployeeCSV(result.data);

      // Create and trigger download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `employee-list-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting employee list:", err);
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
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <ReportToolbar
              projects={projects}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              startDate={startDate}
              endDate={endDate}
              setDateRange={(s, e) => { setStartDate(s); setEndDate(e); }}
              search={search}
              setSearch={setSearch}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setPage={reportPagination.setPage}
              onExport={handleExport}
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
  taskRows={taskData}
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
        onExport={() => {}}
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
      onOpenChange={setProjectModalOpen}
      project={selectedProjectDetails}
    />
  </>
)}
    </div>
  );
}
