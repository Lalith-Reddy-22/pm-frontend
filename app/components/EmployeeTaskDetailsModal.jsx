
"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Search, User, X, ChevronUp, ChevronDown } from "lucide-react";

export default function EmployeeTaskDetailsModal({
  open,
  onOpenChange,
  employee,
  date,
  entry,
  taskDetails,
  loading,
}) {
  const [search, setSearch] = useState("");
const [billingType, setBillingType] = useState("all");

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

        <div className="flex flex-col text-gray-500">
            <ChevronUp size={13}/>
            <ChevronDown size={13} className="-mt-1"/>
        </div>

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

          <span className="rounded-full border border-[#1d3557] px-2 py-[1px] text-[10px] font-bold uppercase text-[#E12927]">
            #{task.id}
          </span>
        </div>

        {/* Bottom */}
        <div className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-gray-600">

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
    </div>
  );
}