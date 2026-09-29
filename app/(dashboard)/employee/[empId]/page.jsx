"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  BriefcaseBusiness,
  Users,
  CheckCircle2,
  Clock3,
  CircleAlert,
  FolderKanban,
  CalendarDays,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDetails,
  fetchEmployeeProjectDetails,
  fetchEmployeeTasks,
  fetchEmployeeTypes,
  fetchEmployeeSubTeams,
  updateEmployee,
} from "@/store/slices/employeeSlice";

export default function EmployeeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  console.log("EMPLOYEE URL PARAM:", params?.empId);
  const dispatch = useDispatch();

 const [showEditModal, setShowEditModal] = useState(false);
const [showProjectsModal, setShowProjectsModal] = useState(false);
const [projectPage, setProjectPage] = useState(1);
const [hoursPeriod, setHoursPeriod] = useState("This Month");

const empId = params?.empId;

  const {
  data: employeeData,
  loading,
  error,

  projects,
  projectsLoading,
  projectsError,
  projectPagination,

  employeeTasks,
  employeeTasksLoading,
  employeeTasksError,

  employeeTypes,
  employeeTypesLoading,

  subTeams,
  subTeamsLoading,
} = useSelector((state) => state.employee);

const recentTasks = (employeeTasks || []).slice(0, 5);

console.log(
  "TASK FOR HOURS:",
  JSON.stringify(employeeTasks?.[0], null, 2)
);

// =====================================================
// TASK STATUS COUNTS
// =====================================================
// API status values:
// 1 = Open / Pending
// 2 = Closed / Completed
// 3 = In Progress
// =====================================================

const completedTasks = (employeeTasks || []).filter(
  (task) => Number(task.status) === 2
).length;

const inProgressTasks = (employeeTasks || []).filter(
  (task) => Number(task.status) === 3
).length;

const pendingTasks = (employeeTasks || []).filter(
  (task) => Number(task.status) === 1
).length;

const hoursData = useMemo(() => {
  const tasks = employeeTasks || [];

  if (tasks.length === 0) {
    return {
      loggedHours: 0,
      billableHours: 0,
      nonBillableHours: 0,
    };
  }

  const getTaskDate = (task) => {
    if (!task?.start_date) return null;

    const [datePart] = task.start_date.split(" ");

    const [month, day, year] = datePart.split("/");

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  };

  const today = new Date();

  const getPeriodDates = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDay();

    if (hoursPeriod === "This Month") {
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 0),
      };
    }

    if (hoursPeriod === "This Week") {
      const start = new Date(today);

      start.setDate(today.getDate() - day);

      const end = new Date(start);

      end.setDate(start.getDate() + 6);

      return {
        start,
        end,
      };
    }

    // Last Month
    return {
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 0),
    };
  };

  const {
    start: periodStart,
    end: periodEnd,
  } = getPeriodDates();

  const periodTasks = tasks.filter((task) => {
    const taskDate = getTaskDate(task);

    if (!taskDate) return false;

    return (
      taskDate >= periodStart &&
      taskDate <= periodEnd
    );
  });

  const loggedHours = periodTasks.reduce(
    (total, task) =>
      total + (Number(task.working_hours) || 0),
    0
  );

  const billableHours = periodTasks.reduce(
    (total, task) =>
      Number(task.buyingCenterId) > 0
        ? total + (Number(task.working_hours) || 0)
        : total,
    0
  );

  const nonBillableHours =
    loggedHours - billableHours;

  return {
    loggedHours,
    billableHours,
    nonBillableHours,
  };
}, [employeeTasks, hoursPeriod]);

const {
  loggedHours,
  billableHours,
  nonBillableHours,
} = hoursData;

  useEffect(() => {
  if (!empId) return;

  console.log("===== EMPLOYEE DASHBOARD FETCH =====");
  console.log("EMP ID:", empId);

  dispatch(fetchEmployeeDetails(empId));

  dispatch(
    fetchEmployeeProjectDetails({
      empId: Number(empId),
      pageNumber: 1,
      pageSize: 10,
    })
  );

  dispatch(fetchEmployeeTypes());
}, [empId, dispatch]);

useEffect(() => {
  const employee = employeeData?.employeeInfo;

  if (!employee?.empId || !employee?.user_Type_val) {
    return;
  }

  console.log("===== FETCH EMPLOYEE TASKS =====");
  console.log("Employee ID:", employee.empId);
  console.log("User Type:", employee.user_Type_val);

  dispatch(
    fetchEmployeeTasks({
      empId: employee.empId,
      userType: employee.user_Type_val,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      pageNumber: 1,
      pageSize: 1000,
    })
  );
}, [employeeData, dispatch]);

useEffect(() => {
  const teamId = employeeData?.employeeInfo?.team_Id_val;

  if (!teamId) return;

  dispatch(fetchEmployeeSubTeams(teamId));
}, [employeeData, dispatch]);

useEffect(() => {
  if (!showProjectsModal || !empId) return;

  dispatch(
    fetchEmployeeProjectDetails({
      empId: Number(empId),
      pageNumber: projectPage,
      pageSize: 10,
    })
  );
}, [
  showProjectsModal,
  projectPage,
  empId,
  dispatch,
]);

if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f9]">
      <div className="flex items-center gap-2">
        <Loader2 size={18} className="animate-spin text-[#E12729]" />
        <p className="text-sm text-gray-500">Loading employee details...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f9]">
      <p className="text-sm text-red-500">
        {error}
      </p>
    </div>
  );
}

if (!employeeData?.employeeInfo) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f9]">
      <p className="text-sm text-gray-500">
        Employee details not found.
      </p>
    </div>
  );
}

const employee = employeeData.employeeInfo;

const utilization = 0;

const stats = [
  {
    title: "Total Tasks",
    value: employeeData.totalTasks ?? 0,
    icon: CheckCircle2,
  },
  {
    title: "Completed",
    value: completedTasks,
    icon: CheckCircle2,
  },
  {
    title: "In Progress",
    value: inProgressTasks,
    icon: Clock3,
  },
  {
    title: "Pending",
    value: pendingTasks,
    icon: CircleAlert,
  },
  {
    title: "Total Projects",
    value: employeeData.totalProjects ?? 0,
    icon: FolderKanban,
  },
];


  return (
    <div className="min-h-screen bg-[#f7f7f9] p-6">
      <div className="mx-auto max-w-[1600px]">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
        type="button"
        onClick={() => router.push("/employee")}
        disabled={loading}
        className="flex items-center gap-1.5 text-lg text-[#E12729] cursor-pointer disabled:opacity-50"
      >
        <ArrowLeft className="w-5 h-4" />
        Back to employees
      </button>
          </div>

          <div className="flex gap-2">
            <Link
  href={`/employee/${employee.empId}/rate-card`}
  className="rounded-md px-4 py-2 border border-[#E12729] bg-white text-[#E12729] hover:bg-red-50"

>
  Rate Card
</Link>

            <button
  type="button"
  onClick={() => setShowEditModal(true)}
  className="rounded-md bg-[#E12729] px-4 py-2 text-sm font-medium text-white cursor-pointer"
>
  Edit Employee
</button>
          </div>
        </div>

        {/* =====================================================
            EMPLOYEE PROFILE
        ===================================================== */}
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold text-red-400 border border-red-300">
                {employee.employee_Name
  ?.split(" ")
  .map((name) => name[0])
  .join("")
  .slice(0, 2)
  .toUpperCase()}
              </div>

              <div>
                <div className="mb-1 flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {employee.employee_Name}
                  </h2>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    ● {employee.isActive === 1 ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mb-3 text-sm text-gray-500">
                  {employee.designation}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    {employee.emailId}
                  </span>

                  <span className="flex items-center gap-2">
                    <Users size={15} />
                    {employee.teams_Name}
                  </span>

                  <span className="flex items-center gap-2">
                    <BriefcaseBusiness size={15} />
                    {employee.user_Type}
                  </span>

                  <span className="flex items-center gap-2">
                    Employee ID: {employee.empId}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ===================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            TASK + HOURS OVERVIEW
        ===================================================== */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Task Overview */}
<div className="rounded-xl border bg-white p-6 shadow-sm">
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-gray-900">
        Task Overview
      </h3>

      <p className="text-sm text-gray-500">
        Current task distribution
      </p>
    </div>
  </div>

  <div className="space-y-5">

    {/* Completed */}
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>Completed</span>

        <span className="font-medium">
          {completedTasks}
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-green-500"
          style={{
            width: `${
              employeeTasks?.length > 0
                ? (completedTasks / employeeTasks.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>

    {/* In Progress */}
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>In Progress</span>

        <span className="font-medium">
          {inProgressTasks}
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{
            width: `${
              employeeTasks?.length > 0
                ? (inProgressTasks / employeeTasks.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>

    {/* Pending */}
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>Pending</span>

        <span className="font-medium">
          {pendingTasks}
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-orange-400"
          style={{
            width: `${
              employeeTasks?.length > 0
                ? (pendingTasks / employeeTasks.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>

  </div>
</div>

          {/* Hours Overview */}
<div className="rounded-xl border bg-white p-6 shadow-sm">
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-gray-900">
        Hours Overview
      </h3>

      <p className="text-sm text-gray-500">
        Employee time utilization
      </p>
    </div>

    <select
      value={hoursPeriod}
      onChange={(e) => setHoursPeriod(e.target.value)}
      className="rounded-lg border px-3 py-2 text-sm"
    >
      <option value="This Month">This Month</option>
      <option value="This Week">This Week</option>
      <option value="Last Month">Last Month</option>
    </select>
  </div>

  <div className="grid grid-cols-3 gap-4">

    {/* Logged Hours */}
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        Logged Hours
      </p>

      <p className="mt-2 text-xl font-semibold text-gray-900">
        {loggedHours.toFixed(1)}h
      </p>
    </div>

    {/* Billable */}
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        Billable
      </p>

      <p className="mt-2 text-xl font-semibold text-gray-900">
        {billableHours.toFixed(1)}h
      </p>
    </div>

    {/* Non-Billable */}
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-500">
        Non-Billable
      </p>

      <p className="mt-2 text-xl font-semibold text-gray-900">
        {nonBillableHours.toFixed(1)}h
      </p>
    </div>

  </div>

  {/* Utilization */}
  <div className="mt-6">
    <div className="mb-2 flex justify-between">
      <span className="text-sm text-gray-500">
        Utilization
      </span>

      <span className="text-sm font-semibold text-gray-900">
        {utilization}%
      </span>
    </div>

    <div className="h-3 rounded-full bg-gray-100">
      <div
        className="h-3 rounded-full bg-primary"
        style={{
          width: `${utilization}%`,
        }}
      />
    </div>
  </div>
</div>
        </div>

        {/* =====================================================
            PROJECT ALLOCATION
        ===================================================== */}
        <div className="mb-6 rounded-xl border bg-white shadow-sm">

          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h3 className="font-semibold text-gray-900">
                Project Allocation
              </h3>

              <p className="text-sm text-gray-500">
                Projects assigned to this employee
              </p>
            </div>

            <button
  onClick={() => {
    setProjectPage(1);
    setShowProjectsModal(true);
  }}
  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
>
  <FolderKanban size={16} />
  View Projects
</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
  <tr>
    <th className="px-6 py-4">Project</th>
    <th className="px-6 py-4">Client</th>
    <th className="px-6 py-4">Status</th>
    <th className="px-6 py-4">Tasks</th>
    <th className="px-6 py-4">Progress</th>
    <th className="px-6 py-4">Actual Hours</th>
  </tr>
</thead>

              {projectsLoading ? (
  <tbody>
    <tr>
      <td
        colSpan={6}
        className="px-6 py-8 text-center text-sm text-gray-500"
      >
        <div className="flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin text-[#E12729]" />
          Loading projects...
        </div>
      </td>
    </tr>
  </tbody>
) : projectsError ? (
  <tbody>
    <tr>
      <td
        colSpan={6}
        className="px-6 py-8 text-center text-sm text-red-500"
      >
        {projectsError}
      </td>
    </tr>
  </tbody>
) : projects.length === 0 ? (
  <tbody>
    <tr>
      <td
        colSpan={6}
        className="px-6 py-8 text-center text-sm text-gray-500"
      >
        No projects found.
      </td>
    </tr>
  </tbody>
) : (
  <tbody className="divide-y">
    {projects.map((project) => {
      const totalTasks = Number(project.total_Tasks || 0);
      const completedTasks = Number(project.completed_Tasks || 0);

      const progress =
        totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

      return (
        <tr
          key={project.project_Id}
          className="hover:bg-gray-50"
        >
          <td className="px-6 py-4">
            <div>
              <span className="font-medium text-gray-900">
                {project.project_title}
              </span>

              <p className="mt-1 text-xs text-gray-400">
                {project.projectCode}
              </p>
            </div>
          </td>

          <td className="px-6 py-4 text-gray-500">
            {project.client_Title}
          </td>

          <td className="px-6 py-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      project.project_Status_Text === "Completed"
        ? "bg-green-50 text-green-600"
        : "bg-blue-50 text-blue-600"
    }`}
  >
    {project.project_Status_Text}
  </span>
</td>

          <td className="px-6 py-4">
            {completedTasks}/{totalTasks}
          </td>

          <td className="min-w-[220px] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="w-10 text-right text-xs font-medium">
                {progress}%
              </span>
            </div>
          </td>

          <td className="px-6 py-4 font-medium">
            {project.logged_Hours}h
          </td>
        </tr>
      );
    })}
  </tbody>
)}
            </table>
          </div>
        </div>

        {/* =====================================================
            RECENT TASKS
        ===================================================== */}
        <div className="rounded-xl border bg-white shadow-sm">

          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h3 className="font-semibold text-gray-900">
                Recent Tasks
              </h3>

              <p className="text-sm text-gray-500">
                Latest assigned and updated tasks
              </p>
            </div>

            <Link
  href={`/tasks?empId=${employee.empId}&userType=${employee.user_Type_val}`}
  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
>
  <CalendarDays size={16} />
  View All Tasks
</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Logged Hours</th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {employeeTasksLoading ? (
  <tr>
    <td
      colSpan={4}
      className="px-6 py-8 text-center text-sm text-gray-500"
    >
      <div className="flex items-center justify-center gap-2">
        <Loader2 size={16} className="animate-spin text-[#E12729]" />
        Loading tasks...
      </div>
    </td>
  </tr>
) : employeeTasksError ? (
  <tr>
    <td
      colSpan={4}
      className="px-6 py-8 text-center text-sm text-red-500"
    >
      {employeeTasksError}
    </td>
  </tr>
) : recentTasks.length === 0 ? (
  <tr>
    <td
      colSpan={4}
      className="px-6 py-8 text-center text-sm text-gray-500"
    >
      No recent tasks found.
    </td>
  </tr>
) : (
  recentTasks.slice(0, 5).map((task) => (
    <tr
      key={task.task_Id}
      className="hover:bg-gray-50"
    >
      <td className="px-6 py-4 font-medium text-gray-900">
        {task.task_Title}
      </td>

      <td className="px-6 py-4 text-gray-500">
        {task.project_Title}
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={task.status} />
      </td>

      <td className="px-6 py-4 font-medium">
        {task.working_hours ?? 0}h
      </td>
    </tr>
  ))
)}

              </tbody>
            </table>
          </div>
        </div>

      </div>

       {showEditModal && (
        <EditEmployeeModal
          employee={employee}
          empId={Number(empId)}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showProjectsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowProjectsModal(false)}
        >
          <div
            className="w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Allocation
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  All projects assigned to {employee.employee_Name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProjectsModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* PROJECT COUNT */}
            <div className="border-b bg-gray-50 px-6 py-3">
              <span className="text-sm text-gray-500">
                Total Projects:
              </span>

              <span className="ml-2 font-semibold text-gray-900">
                {projectPagination?.totalCount || 0}
              </span>
            </div>

            {/* TABLE */}
            <div className="max-h-[65vh] overflow-auto">
              {projectsLoading ? (
                <div className="py-16 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#E12729]" />
                    Loading projects...
                  </div>
                </div>
              ) : projectsError ? (
                <div className="py-16 text-center text-sm text-red-500">
                  {projectsError}
                </div>
              ) : projects.length === 0 ? (
                <div className="py-16 text-center text-sm text-gray-500">
                  No projects found.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b text-xs uppercase text-gray-500">
                      <th className="px-6 py-4">
                        Project
                      </th>

                      <th className="px-6 py-4">
                        Client
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Tasks
                      </th>

                      <th className="px-6 py-4">
                        Progress
                      </th>

                      <th className="px-6 py-4">
                        Actual Hours
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {projects.map((project) => {
                      const totalTasks =
                        Number(project.total_Tasks) || 0;

                      const completedTasks =
                        Number(project.completed_Tasks) || 0;

                      const progress =
                        totalTasks > 0
                          ? Math.round(
                              (completedTasks / totalTasks) * 100
                            )
                          : 0;

                      return (
                        <tr
                          key={project.project_Id}
                          className="hover:bg-gray-50"
                        >
                          {/* PROJECT */}
                          <td className="px-6 py-4">
                            <div className="max-w-md">
                              <p className="font-medium text-gray-900">
                                {project.project_title}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                Code: {project.projectCode}
                              </p>
                            </div>
                          </td>

                          {/* CLIENT */}
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {project.client_Title}
                          </td>

                          {/* STATUS */}
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                              {project.project_Status_Text}
                            </span>
                          </td>

                          {/* TASKS */}
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {completedTasks}/{totalTasks}
                          </td>

                          {/* PROGRESS */}
                          <td className="px-6 py-4">
                            <div className="w-32">
                              <div className="mb-1 flex justify-between text-xs text-gray-500">
                                <span>{progress}%</span>
                              </div>

                              <div className="h-2 rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-blue-500"
                                  style={{
                                    width: `${progress}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* HOURS */}
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {Number(project.logged_Hours || 0)}h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            {!projectsLoading &&
              projectPagination?.totalPages > 0 && (
                <div className="flex items-center justify-between border-t px-6 py-4">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-900">
                      {(projectPage - 1) * 10 + 1}
                    </span>
                    {" - "}
                    <span className="font-medium text-gray-900">
                      {Math.min(
                        projectPage * 10,
                        projectPagination.totalCount
                      )}
                    </span>
                    {" of "}
                    <span className="font-medium text-gray-900">
                      {projectPagination.totalCount}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={projectPage === 1}
                      onClick={() =>
                        setProjectPage((prev) => prev - 1)
                      }
                      className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="px-3 text-sm text-gray-600">
                      Page {projectPage} of{" "}
                      {projectPagination.totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={
                        projectPage ===
                        projectPagination.totalPages
                      }
                      onClick={() =>
                        setProjectPage((prev) => prev + 1)
                      }
                      className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
/* =============================================================
   STATUS BADGE
============================================================= */

function StatusBadge({ status }) {
  const taskStatus = Number(status);

  if (taskStatus === 2) {
    return (
      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
        Completed
      </span>
    );
  }

  if (taskStatus === 3) {
    return (
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        In Progress
      </span>
    );
  }

  return (
    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
      Pending
    </span>
  );
}

function EditEmployeeModal({ employee, empId, onClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: employee.employee_Name || "",
    email: employee.emailId || "",
    designation: employee.designation || "",
    team: employee.team_Id_val?.toString() || "",
    shortDesignation: employee.empDesignation || "",
    hours: employee.empHours?.toString() || "",
    utilizationRequired:
      employee.utilizationRequired === 1 ? "Yes" : "No",
    activeStatus:
      employee.isActive === 1 ? "Active" : "Inactive",
    employeeType: employee.user_Type_val?.toString() || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
  try {
    const payload = {
      empName: formData.name.trim(),
      email: formData.email.trim(),
      designation: formData.designation.trim(),
      team: Number(formData.team),
      empType: Number(formData.employeeType),
      isActive: formData.activeStatus === "Active" ? 1 : 0,
      empHours: Number(formData.hours) || 0,
      shortDesignation: formData.shortDesignation.trim(),
      isUtilRequired:
        formData.utilizationRequired === "Yes" ? 1 : 0,
      updatedBy: 10,
    };

    console.log("===== UPDATE EMPLOYEE =====");
    console.log("EMP ID:", empId);
    console.log("PAYLOAD:", payload);

    const response = await dispatch(
      updateEmployee({
        empId: Number(empId),
        employeeData: payload,
      })
    ).unwrap();

    console.log("UPDATE SUCCESS:", response);

    toast.success("Employee details updated successfully.");

    onClose();

    window.location.reload();
  } catch (error) {
    console.error("UPDATE FAILED:", error);

    toast.error(
      typeof error === "string"
        ? error
        : "Failed to update employee details."
    );
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[800px] rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Employee Information
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">

          {/* Employee Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Employee Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Employee Designation */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Designation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) =>
                handleChange("designation", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Employee Team */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Team
            </label>
            <select
              value={formData.team}
              onChange={(e) => handleChange("team", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Select Team</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="QA">QA</option>
              <option value="Management">Management</option>
            </select>
          </div>

          {/* Short Designation */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Short Designation
            </label>
            <input
              type="text"
              value={formData.shortDesignation}
              onChange={(e) =>
                handleChange("shortDesignation", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Hours */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Hours
            </label>
            <input
              type="number"
              value={formData.hours}
              onChange={(e) => handleChange("hours", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Utilization Required */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Utilization Required
            </label>
            <select
              value={formData.utilizationRequired}
              onChange={(e) =>
                handleChange("utilizationRequired", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Active Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Active Status
            </label>
            <select
              value={formData.activeStatus}
              onChange={(e) =>
                handleChange("activeStatus", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Employee Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee Type
            </label>
            <select
              value={formData.employeeType}
              onChange={(e) =>
                handleChange("employeeType", e.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Select Type</option>
<option value="Employee">Employee</option>
<option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-red-200 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-50"
          >
            Cancel
          </button>

         <button
  type="button"
  onClick={handleUpdate}
  className="rounded-md px-5 py-2 text-sm font-medium text-white bg-red-600"
>
  Update Details
</button>
        </div>
      </div>

    </div>
  );
}