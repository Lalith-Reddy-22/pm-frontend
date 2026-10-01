
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  CalendarDays,
  Search,
  User,
  X,
  ChevronUp,
  ChevronDown,
  UserRoundPen,
} from "lucide-react";
import axiosClient from "@/services/axiosClient";
import { toast } from "react-toastify";

export default function EmployeeTaskDetailsModal({
  open,
  onOpenChange,
  employee,
  date,
  entry,
  taskDetails,
  loading,
  onReassigned,
}) {
const [search, setSearch] = useState("");
const [billingType, setBillingType] = useState("all");

const [reassignTask, setReassignTask] = useState(null);
const [newEmployee, setNewEmployee] = useState("");
const [reassignLoading, setReassignLoading] = useState(false);

const [employees, setEmployees] = useState([]);
const [employeesLoading, setEmployeesLoading] = useState(false);

const [employeeSearch, setEmployeeSearch] = useState("");
const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);

useEffect(() => {
  if (!reassignTask) return;

  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true);

      const response = await axiosClient.get("/employee/names");

      const activeEmployees = (response.data || [])
  .filter(
    (emp) =>
      String(emp.status || "").toLowerCase() === "active" &&
      Number(emp.employeeId) !== Number(employee?.id)
  )
  .filter(
    (emp, index, arr) =>
      index ===
      arr.findIndex(
        (item) => Number(item.employeeId) === Number(emp.employeeId)
      )
  );

      setEmployees(activeEmployees);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  loadEmployees();
}, [reassignTask, employee?.id]);

const filteredEmployees = useMemo(() => {
  const searchText = employeeSearch.trim().toLowerCase();

  if (!searchText) {
    return employees;
  }

  return employees.filter((emp) =>
    String(emp.employeeName || "")
      .toLowerCase()
      .includes(searchText)
  );
}, [employees, employeeSearch]);

const handleReassign = async () => {
  if (!reassignTask || !newEmployee) {
    return;
  }

  try {
    setReassignLoading(true);

    const request = {
      taskId: Number(reassignTask.id),
      oldEmployeeId: Number(employee?.id),
      newEmployeeId: Number(newEmployee),
    };

    console.log("Reassign request:", request);

    const response = await axiosClient.post(
      "/Task/reassign",
      request
    );

    console.log("Reassign response:", response.data);

    if (response.data?.success) {
  toast.success(
  response.data.message || "Task reassigned successfully."
);

  setReassignTask(null);
  setNewEmployee("");
  setEmployeeSearch("");
  setEmployeeDropdownOpen(false);

  if (onReassigned) {
    await onReassigned();
  }
} else {
      toast.error(
  response.data?.message || "Unable to reassign task."
);
    }
  } catch (error) {
    console.error("Reassign task failed:", error);

    toast.error(
  error?.response?.data?.message ||
    "Failed to reassign task."
);
  } finally {
    setReassignLoading(false);
  }
};

  const role =
    typeof window !== "undefined"
      ? sessionStorage.getItem("role") || "employee"
      : "employee";

  const isAdminView = ["admin", "sys_admin", "management_admin"].includes(role);

  const tasks = useMemo(() => {
  return (taskDetails?.tasks || []).map((task) => {
    const buyingCenterId = Number(
      task.BuyingCenterId ?? task.buyingCenterId ?? 0
    );

    const billingType =
      buyingCenterId === 0 || buyingCenterId === 25
        ? "nonbillable"
        : "billable";

    return {
      id: task.task_Id,
      title: task.task_Title,
      planned: Number(task.working_hours ?? 0),
      logged: Number(task.logged_hours ?? 0),
      priority: task.tskpriority || "Low",
      owner: task.taskowner || "-",
      buyingCenterId,
      billingType,
    };
  });
}, [taskDetails]);

const billableCount = useMemo(() => {
  return tasks.filter(
    (task) => task.billingType === "billable"
  ).length;
}, [tasks]);

const nonBillableCount = useMemo(() => {
  return tasks.filter(
    (task) => task.billingType === "nonbillable"
  ).length;
}, [tasks]);

  const filtered = useMemo(() => {
  return tasks.filter((task) => {
    const matchesBilling =
      billingType === "all" ||
      task.billingType === billingType;

    const searchText = search.toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      task.owner.toLowerCase().includes(searchText) ||
      String(task.id).includes(searchText);

    return matchesBilling && matchesSearch;
  });
}, [tasks, search, billingType]);

    const totalPlannedHours = useMemo(() => {
  return tasks.reduce((sum, task) => sum + task.planned, 0);
}, [tasks]);

  const badge = (p) => {
    if (p === "High") return "bg-red-500";
    if (p === "Medium") return "bg-orange-400";
    return "bg-green-500";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex h-[82vh] w-[900px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarDays size={17}/>
            <span>
  {taskDetails?.header?.date ||
    (date ? date.toLocaleDateString() : "")}
</span>
            <span>|</span>
            <User size={17}/>
            <span className="font-semibold">
  {taskDetails?.header?.employee_Name ||
    employee?.name ||
    ""}
</span>
            <span className="rounded-sm px-2 py-1 text-xs font-semibold text-[#E12927]">
   [ Planned: {totalPlannedHours} hrs ]
  </span>
          </div>
          <button onClick={() => onOpenChange(false)} className="rounded p-2 hover:bg-gray-100">
            <X size={20}/>
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-3">

  {/* BILLING TABS */}
  {isAdminView ? (
    <div className="flex items-center gap-2">

      <button
        type="button"
        onClick={() => setBillingType("all")}
        className={`rounded px-4 py-2 text-xs font-semibold ${
          billingType === "all"
            ? "bg-[#333] text-white"
            : "border border-gray-300 bg-white text-gray-700"
        }`}
      >
        All ({tasks.length})
      </button>

      <button
        type="button"
        onClick={() => setBillingType("billable")}
        className={`rounded px-4 py-2 text-xs font-semibold ${
          billingType === "billable"
            ? "bg-[#333] text-white"
            : "border border-gray-300 bg-white text-gray-700"
        }`}
      >
        Billable ({billableCount})
      </button>

      <button
        type="button"
        onClick={() => setBillingType("nonbillable")}
        className={`rounded px-4 py-2 text-xs font-semibold ${
          billingType === "nonbillable"
            ? "bg-[#333] text-white"
            : "border border-gray-300 bg-white text-gray-700"
        }`}
      >
        Non-Billable ({nonBillableCount})
      </button>

    </div>
  ) : (
    <div />
  )}

  {/* SEARCH */}
  <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Search:</span>
            <div className="flex items-center rounded border border-gray-300 px-2">
              <Search size={16} className="text-gray-400"/>
              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="h-8 w-48 px-2 text-sm outline-none"
              />
            </div>
          </div>
        </div>


  <div className="mx-6 mt-5 overflow-hidden rounded border border-gray-300 ">

    {/* Header */}
    <div className="flex items-center justify-between border-b bg-[#f5f5f5] px-5 py-3 sticky z-10 top-0">

        <h3 className="text-[13px] font-semibold uppercase tracking-[2px] text-[#1d3557]">
            Task Details
        </h3>

        {/* <div className="flex flex-col text-gray-500">
            <ChevronUp size={13}/>
            <ChevronDown size={13} className="-mt-1"/>
        </div> */}

    </div>

    {/* Scroll Body */}
    <div className="h-[295px] overflow-y-auto bg-white">

  {loading ? (
    <div className="py-10 text-center text-gray-500">
      Loading task details...
    </div>
  ) : filtered.length > 0 ? (
    filtered.map((task) => (
      <div
        key={task.id}
        className="border-b border-gray-200 px-6 py-3 hover:bg-gray-50"
      >
        {/* Task Name */}
        <div className="mt-1 flex items-center gap-2 text-[15px] leading-5 text-gray-700">
          {task.title}

          <button
  type="button"
  onClick={() => {
    window.open(`/tasks/create?taskId=${task.id}`, "_blank");
  }}
  className="rounded-full border border-[#1d3557] px-2 py-[1px] text-[10px] font-bold uppercase text-[#E12927] hover:bg-red-50 hover:text-[#E12927] cursor-pointer"
>
  #{task.id}
</button>
        </div>

        {/* Bottom */}
        <div className="mt-1 flex items-center justify-between">

  <div className="flex items-center gap-1 text-[12px] font-semibold text-gray-600">

    <span>
      P : {task.planned}
    </span>

    <span>|</span>

    <span>
      L : {task.logged}
    </span>

    <span
      className={`ml-1 rounded px-2 py-[1px] text-[10px] font-bold uppercase text-white ${badge(
        task.priority
      )}`}
    >
      {task.priority}
    </span>

    <span className="flex items-center gap-1 text-gray-600">
      <User size={12} />
      {task.owner}
    </span>

  </div>

  {isAdminView && (
    <button
      type="button"
      onClick={() => {
        setReassignTask(task);
        setNewEmployee("");
      }}
      className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-[11px] font-semibold text-gray-700 hover:border-[#1d3557] hover:bg-gray-50"
    >
      <UserRoundPen size={13} />
      Reassign
    </button>
  )}

</div>
      </div>
    ))
  ) : (
    <div className="py-10 text-center text-gray-500">
      No tasks found for this date.
    </div>
  )}

</div>

</div>

      </div>

      {reassignTask && (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm">

    <div className="w-[420px] rounded-lg bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">

        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Reassign Task
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Task #{reassignTask.id}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setReassignTask(null);
            setNewEmployee("");
          }}
          className="rounded p-1 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

      </div>

      {/* Body */}
      <div className="space-y-4 px-5 py-5">

        {/* Task */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Task
          </label>

          <div className="rounded border bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {reassignTask.title}
          </div>
        </div>

        {/* Current employee */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Current Employee
          </label>

          <div className="flex items-center gap-2 rounded border bg-gray-50 px-3 py-2 text-sm text-gray-700">
            <User size={15} />
            {reassignTask.owner}
          </div>
        </div>

        {/* New employee */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">
            Reassign To
          </label>

          <div className="relative">

  {/* Selected employee / dropdown button */}
  <button
    type="button"
    onClick={() => setEmployeeDropdownOpen((prev) => !prev)}
    className="flex h-10 w-full items-center justify-between rounded border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none hover:border-[#1d3557]"
  >
    <span>
      {newEmployee
        ? employees.find(
            (emp) => String(emp.employeeId) === String(newEmployee)
          )?.employeeName || "Select Employee"
        : "Select Employee"}
    </span>

    <ChevronDown size={16} />
  </button>

  {/* Dropdown */}
  {employeeDropdownOpen && (
    <div className="absolute left-0 top-11 z-[10001] w-full rounded border border-gray-300 bg-white shadow-lg">

      {/* Search */}
      <div className="border-b border-gray-200 p-2">

        <div className="flex items-center rounded border border-gray-300 px-2">

          <Search
            size={15}
            className="text-gray-400"
          />

          <input
            type="text"
            value={employeeSearch}
            onChange={(e) =>
              setEmployeeSearch(e.target.value)
            }
            placeholder="Search employee..."
            className="h-8 w-full px-2 text-sm outline-none"
            autoFocus
          />

        </div>

      </div>

      {/* Employee list */}
      <div className="max-h-48 overflow-y-auto">

        {employeesLoading ? (
          <div className="px-3 py-3 text-center text-sm text-gray-500">
            Loading employees...
          </div>
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp, index) => (
            <button
              key={`${emp.employeeId}-${index}`}
              type="button"
              onClick={() => {
                setNewEmployee(String(emp.employeeId));
                setEmployeeDropdownOpen(false);
                setEmployeeSearch("");
              }}
              className="flex w-full items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >

              {emp.employeeName}
            </button>
          ))
        ) : (
          <div className="px-3 py-3 text-center text-sm text-gray-500">
            No employees found
          </div>
        )}

      </div>

    </div>
  )}

</div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t px-5 py-4">

        <button
          type="button"
          onClick={() => {
            setReassignTask(null);
            setNewEmployee("");
          }}
          className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
  type="button"
  onClick={handleReassign}
  disabled={!newEmployee || reassignLoading}
  className="rounded bg-[#1d3557] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
>
  {reassignLoading ? "Reassigning..." : "Reassign"}
</button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}