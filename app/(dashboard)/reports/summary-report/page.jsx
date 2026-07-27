"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import ReportToolbar from "./components/ReportToolbar";
import ReportTable from "./components/ReportTable";
import EmployeeToolbar from "./components/EmployeeToolbar";
import EmployeeTable from "./components/EmployeeTable";
import DataPagination from "@/components/DataPagination";
import { usePagination } from "@/hooks/usePagination";
import {
  getTaskAllocationReport,
  getProjects,
  generateCSV,
} from "@/services/taskAllocationReportService";
import {
  getEmployeeList,
  generateEmployeeCSV,
} from "@/services/employeeListService";
import EmployeeTaskModal from "./components/EmployeeTaskModal";
import ProjectTable from "./components/ProjectTable";
import ProjectDetailsModal from "./components/ProjectDetailsModal";

export default function SummaryReportPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState("task-allocation");

  // Filter state
  const [selectedProject, setSelectedProject] = useState("all");
  const [startDate, setStartDate] = useState(() => new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(() => new Date());
  const [search, setSearch] = useState("");

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
  const [projectData, setProjectData] = useState([]);
  const [projectTotal, setProjectTotal] = useState(0);
  const [projectIsLoading, setProjectIsLoading] = useState(false);

const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
const [projectModalOpen, setProjectModalOpen] = useState(false);

  // Data state
  const [projects, setProjects] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

  // usePagination hooks (server-driven — data slice comes from API, hook drives UI only)
  const reportPagination = usePagination({ data: reportData, pageSize });
  const employeePagination = usePagination({ data: employeeData, pageSize: employeePageSize });
  const projectPagination = usePagination({ data: projectData, pageSize: projectPageSize });

  /**
   * Fetch report data whenever filters or pagination changes
   */
  const fetchReportData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters = {
        projectId: selectedProject,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
        search,
        sortBy: "projectCode",
        sortDirection: "asc",
        page: reportPagination.page,
        pageSize,
      };

      const result = await getTaskAllocationReport(filters);
      setReportData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err.message || "Failed to load report data");
      console.error("Error fetching report:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, startDate, endDate, search, reportPagination.page, pageSize]);

  /**
   * Fetch projects for filter dropdown on mount
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
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

  setProjectData([
    {
      projectId: 6783,
      projectTitle: "Operations Tasks_Shijin_Internal",
      projectCode: "017",
    },
    {
      projectId: 6784,
      projectTitle: "AIM XR Static Banner_New1_MAT-US-ELA-00218",
      projectCode: "841",
    },
    {
      projectId: 6785,
      projectTitle: "Learning & Upskilling",
      projectCode: "903",
    },
  ]);

  setProjectTotal(3);
}, [activeTab]);

  /**
   * Fetch report data whenever pagination changes
   */
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  /**
   * Fetch employee list
   */
  const fetchEmployeeData = useCallback(async () => {
    try {
      setEmployeeIsLoading(true);

      const filters = {
        search: employeeSearch,
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
  }, [employeeSearch, employeePagination.page, employeePageSize]);

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
              rows={reportData}
              isLoading={isLoading}
              emptyMessage={
                search || selectedProject !== "all"
                  ? "No records match your filters"
                  : "No records available"
              }
            />

            {/* Pagination */}
            {reportData.length > 0 && (
              <DataPagination {...reportPagination} />
            )}
          </div>

          {/* Summary Stats */}
          {/* {reportData.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Records
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">{total}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Planned Cost
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${reportData
                    .reduce((sum, item) => sum + item.plannedCost, 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Actual Cost
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${reportData
                    .reduce((sum, item) => sum + item.actualCost, 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Total Difference
                </p>
                <p className={`mt-1 text-2xl font-bold ${
                  reportData.reduce((sum, item) => sum + item.difference, 0) > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}>
                  {reportData.reduce((sum, item) => sum + item.difference, 0) > 0 ? "+" : ""}
                  ${Math.abs(reportData.reduce((sum, item) => sum + item.difference, 0)).toLocaleString()}
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
    emptyMessage={
      employeeSearch
        ? "No employees match your search"
        : "No employees available"
    }
    onViewEmployee={(employee) => {
      setSelectedEmployee(employee);
      setEmployeeModalOpen(true);
    }}
  />

  {employeeData.length > 0 && (
    <DataPagination {...employeePagination} />
  )}

  <EmployeeTaskModal
  open={employeeModalOpen}
  onOpenChange={setEmployeeModalOpen}
  employee={selectedEmployee}
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
        rows={projectData}
        isLoading={projectIsLoading}
        onViewProject={(project) => {
          setSelectedProjectDetails(project);
          setProjectModalOpen(true);
        }}
      />

      {projectData.length > 0 && (
        <DataPagination {...projectPagination} />
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
