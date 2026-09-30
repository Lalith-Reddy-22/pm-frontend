"use client";

import { X, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import DataPagination from "@/components/DataPagination";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeTaskDetails,
} from "@/store/slices/summaryReportSlice";

export default function EmployeeTaskModal({
  open,
  onOpenChange,
  employee,
  startDate,
  endDate,
  taskRows = [],
}) {

  console.log("EMPLOYEE RECEIVED IN MODAL:", employee);
console.log("EMPLOYEE ID:", employee?.id);
console.log("EMPLOYEE EMP_ID:", employee?.emp_ID);

  const dispatch = useDispatch();

   console.log("SELECTED EMPLOYEE:", employee);

const {
  employeeTaskDetails,
  employeeTaskDetailsLoading,
  employeeTaskDetailsTotal,
  employeeTaskDetailsTotalPages,
} = useSelector(
  (state) => state.summaryReport
);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [showExport, setShowExport] = useState(false);

useEffect(() => {
  if (!open || !employee) return;

  const employeeId =
    employee?.empId ??
    employee?.id ??
    employee?.emp_ID ??
    employee?.employeeId;

  if (!employeeId || Number(employeeId) <= 0) {
    console.error("❌ Invalid Employee ID:", employeeId);
    return;
  }

  console.log("========== FETCH EMPLOYEE TASKS ==========");
  console.log("Employee Name:", employee?.name);
  console.log("Employee ID:", employeeId);

  dispatch(
    fetchEmployeeTaskDetails({
      employeeId: Number(employeeId),
      searchText: search.trim(),
      pageNumber: page,
      pageSize,
    })
  );
}, [
  dispatch,
  open,
  employee,
  search,
  page,
  pageSize,
]);

const rows = (employeeTaskDetails || []).map((row, index) => ({
  id:
    row.id ??
    row.task_ID ??
    row.task_Id ??
    row.task_id ??
    index,

  title:
    row.title ??
    row.task_Title ??
    row.Task_Title ??
    row.taskTitle ??
    "",

  start:
    row.start ??
    row.startDate ??
    row.StartDate ??
    row.start_Date ??
    row.start_Date_Formatted ??
    "",

  end:
    row.end ??
    row.endDate ??
    row.EndDate ??
    row.end_Date ??
    row.end_Date_Formatted ??
    "",

  actual:
    row.actual ??
    row.actualHours ??
    row.ActualHours ??
    row.logHours ??
    0,

  planned:
    row.planned ??
    row.plannedHours ??
    row.Planned_hours ??
    row.planneHours ??
    0,

  tasks:
    row.tasks ??
    row.task_Count ??
    row.taskCount ??
    "",
}));

const totalItems = employeeTaskDetailsTotal || 0;

const totalPages = Math.max(
  1,
  employeeTaskDetailsTotalPages ||
    Math.ceil(totalItems / pageSize)
);

const startIndex =
  totalItems === 0
    ? 0
    : (page - 1) * pageSize + 1;

const endIndex =
  totalItems === 0
    ? 0
    : Math.min(page * pageSize, totalItems);

const hasPrev = page > 1;
const hasNext = page < totalPages;

const prevPage = () => {
  if (hasPrev) {
    setPage((prev) => prev - 1);
  }
};

const nextPage = () => {
  if (hasNext) {
    setPage((prev) => prev + 1);
  }
};

const goToPage = (pageNumber) => {
  if (
    pageNumber >= 1 &&
    pageNumber <= totalPages
  ) {
    setPage(pageNumber);
  }
};

const pageNumbers = Array.from(
  { length: totalPages },
  (_, index) => index + 1
);


useEffect(() => {
  setPage(1);
}, [search]);

console.log("========== TASK DETAILS ==========");
console.log("RAW TASK DETAILS:", employeeTaskDetails);
console.log("ROWS:", rows);

if (rows?.[0]) {
  console.log("FIRST TASK:", rows[0]);
  console.log("TASK FIELD NAMES:", Object.keys(rows[0]));
}

  if (!open || !employee) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
<div className="flex h-[85vh] w-full max-w-7xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl mt-4">
            Employee Name :
            <span className="ml-2 text-black-400">
              {employee?.name ?? employee?.employee_name ?? "Employee"}
            </span>
          </h2>

          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
<div className="relative z-20 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Search:</span>

            <div className="flex items-center rounded-md border px-2">
              <Search size={16} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-2 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              Show
              <select
  className="mx-2 rounded border px-2 py-1"
  value={pageSize}
  onChange={(e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  }}
>
  <option value={5}>5</option>
  <option value={10}>10</option>
  <option value={20}>20</option>
</select>
              entries
            </div>

            <div className="relative">
  {/* <button
    onClick={() => setShowExport(!showExport)}
    className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 hover:bg-gray-50"
  >
    Export
    <ChevronDown size={16} />
  </button>

  {showExport && (
<div className="absolute right-0 top-full mt-2 z-[9999] w-40 rounded-md border bg-white shadow-xl">      <button
        onClick={() => {
          setShowExport(false);
          console.log("Export Excel");
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export Excel
      </button>

      <button
        onClick={() => {
          setShowExport(false);
          console.log("Export CSV");
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export CSV
      </button>

      <button
        onClick={() => {
          setShowExport(false);
          console.log("Export PDF");
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export PDF
      </button>
    </div>
  )} */}
</div>
          </div>

        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">

          <table className="w-full">

            <thead className="sticky top-0 bg-[#F2F2F2]">
              <tr className="border-b text-left text-sm">

                {[
                  "Task ID",
                  "Task Title",
                  "Start Date",
                  "End Date",
                  "Actual Hours",
                  "Planned Hours",
                  "Tasks",
                ].map((item) => (
                  <th key={item} className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {item}

                      {/* <div className="flex flex-col">
                        <ChevronUp size={12} />
                        <ChevronDown size={12} />
                      </div> */}
                    </div>
                  </th>
                ))}

              </tr>
            </thead>

            <tbody>
  {employeeTaskDetailsLoading ? (
    <tr>
      <td
        colSpan={7}
        className="px-5 py-8 text-center text-gray-500"
      >
        Loading tasks...
      </td>
    </tr>
  ) : rows.length > 0 ? (
  rows.map((row, index) => (
    <tr
      key={row.id ?? index}
      className="border-b"
    >
        <td className="px-5 py-4">
          {row.id || "—"}
        </td>

        <td className="px-5 py-4">
          {row.title || "—"}
        </td>

        <td className="px-5 py-4">
          {row.start || "—"}
        </td>

        <td className="px-5 py-4">
          {row.end || "—"}
        </td>

        <td className="px-5 py-4">
          {row.actual ?? "—"}
        </td>

        <td className="px-5 py-4">
          {row.planned ?? "—"}
        </td>

        <td className="px-5 py-4">
          {row.tasks || "—"}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={7}
        className="px-5 py-8 text-center text-gray-500"
      >
        {search.trim()
          ? "No tasks match your search."
          : "No tasks found."}
      </td>
    </tr>
  )}
</tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">

          <DataPagination
  page={page}
  totalPages={totalPages}
  totalItems={totalItems}
  startIndex={startIndex}
  endIndex={endIndex}
  hasPrev={hasPrev}
  hasNext={hasNext}
  prevPage={prevPage}
  nextPage={nextPage}
  goToPage={goToPage}
  pageNumbers={pageNumbers}
/>
        </div>

      </div>
    </div>
  );
}