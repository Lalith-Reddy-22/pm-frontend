"use client";

import { useEffect, useMemo, useState } from "react";
import { useEmployeeNames } from "@/hooks/useEmployeeNames";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

import { useTheme } from "../../../context/ThemeContext";

import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/ui/CustomSelect";
import DatePicker from "@/app/components/DatePicker";
import ExportDropdown from "@/app/(dashboard)/employee/components/ExportDropdown";
import DataPagination from "@/components/DataPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyReports } from "@/store/slices/dailyReportSlice";
import { exportFile } from "@/store/slices/exportSlice";

// ---------------------------------------------------------
// PRIORITY STYLES
// ---------------------------------------------------------

const PRIORITY_STYLES = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
  Critical: "bg-violet-100 text-violet-700",
  Tentative: "bg-blue-100 text-blue-700",
};


// ---------------------------------------------------------
// PRIORITY BADGE
// ---------------------------------------------------------

function PriorityBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        PRIORITY_STYLES[value] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {value || "-"}
    </span>
  );
}


// ---------------------------------------------------------
// PAGE
// ---------------------------------------------------------

export default function DailyReportPage() {
  const { t, isDark } = useTheme();

  const dispatch = useDispatch();

const {
  data: apiReports = [],
  totalRecords,
  pageNumber: apiPageNumber,
  pageSize: apiPageSize,
  totalPages,
  loading: reportsLoading,
  error: reportsError,
} = useSelector((state) => state.dailyReport);

  const {
  data: employees = [],
  isLoading: employeesLoading,
  isError: employeesError,
} = useEmployeeNames();

  // -------------------------------------------------------
  // STATE
  // -------------------------------------------------------

  const [employeeFilter, setEmployeeFilter] =
    useState("All Employees");

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [showExport, setShowExport] =
    useState(false);

  const [sorting, setSorting] =
    useState([]);

  const [searchInput, setSearchInput] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [pagination, setPagination] =
    useState({
      pageIndex: 0,
      pageSize: 10,
    });

  const MIN_SEARCH_LENGTH = 2;

  useEffect(() => {
    const trimmed = searchInput.trim();

    if (!trimmed) {
      setSearchQuery("");
      return;
    }

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setSearchQuery("");
      return;
    }

    const timer = setTimeout(() => {
      setSearchQuery(trimmed);
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // -------------------------------------------------------
  // FORMAT DATE FOR API
  // -------------------------------------------------------

  const formattedDate = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

    useEffect(() => {
  if (!formattedDate) return;

  const hasSearch = Boolean(searchQuery.trim());

  dispatch(
    fetchDailyReports({
      todayDate: formattedDate,
      resourceName: employeeFilter,
      searchText: hasSearch ? searchQuery : "",
      pageNumber: hasSearch ? 1 : pagination.pageIndex + 1,
      pageSize: hasSearch ? 5000 : pagination.pageSize,
    })
  );
}, [
  dispatch,
  formattedDate,
  employeeFilter,
  searchQuery,
  pagination.pageIndex,
  pagination.pageSize,
]);


  // -------------------------------------------------------
  // TANSTACK QUERY
  // -------------------------------------------------------


  // -------------------------------------------------------
  // API RESPONSE
  // -------------------------------------------------------
  // -------------------------------------------------------
  // MAP API DATA TO UI DATA
  // -------------------------------------------------------
  //
  // Backend:
  //
  // task_ID
  // tskpriority
  // resourceName
  // projectId
  // projectName
  // taskName
  // allocStartTime
  // allocEndTime
  // owner
  // working_hours
  // teamName
  // projectCode
  // clientName
  //
  // UI:
  //
  // id
  // priority
  // resourceName
  // projectTitle
  // taskTitle
  // startTime
  // endTime
  // owner
  // allocatedHours
  // department
  // projectCode
  // client
  // -------------------------------------------------------

  const reports = useMemo(() => {
  return apiReports.map((report) => ({
    id: report.task_ID,
    priority: report.tskpriority ?? "",
    resourceName: report.resourceName ?? "",
    department: report.teamName ?? "",
    projectId: report.projectId,
    projectTitle: report.projectName ?? "",
    taskTitle: report.taskName ?? "",
    owner: report.owner ?? "",
    allocatedHours: report.working_hours ?? 0,
    client: report.clientName ?? "",
    projectCode: report.projectCode ?? "",
    startTime: report.allocStartTime ?? "",
    endTime: report.allocEndTime ?? "",
  }));
}, [apiReports]);

const filteredReports = useMemo(() => {
  const normalizedSearch = searchInput.trim().toLowerCase();

  if (!normalizedSearch) {
    return reports;
  }

  return reports.filter((report) =>
    [
      report.resourceName,
      report.taskTitle,
      report.projectTitle,
      report.owner,
      report.client,
      report.department,
      report.projectCode,
      String(report.id ?? ""),
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(normalizedSearch)
    )
  );
}, [reports, searchInput]);

const handleExport = (format) => {
  const rows = table
    .getFilteredRowModel()
    .rows
    .map((row) => row.original);

  const columns = [
    { key: "resourceName", header: "Resource" },
    { key: "id", header: "Task ID" },
    { key: "taskTitle", header: "Task Title" },
    { key: "owner", header: "Task Owner" },
    { key: "allocatedHours", header: "Allocated Hours" },
    { key: "client", header: "Client" },
    { key: "projectTitle", header: "Project Title" },
    { key: "startTime", header: "Start Time" },
    { key: "endTime", header: "End Time" },
  ];

  const data = rows.map((row) => ({
    resourceName: row.resourceName ?? "",
    id: row.id ?? "",
    taskTitle: row.taskTitle ?? "",
    owner: row.owner ?? "",
    allocatedHours: row.allocatedHours ?? 0,
    client: row.client ?? "",
    projectTitle: row.projectCode
      ? `${row.projectCode} - ${row.projectTitle}`
      : row.projectTitle ?? "",
    startTime: row.startTime ?? "",
    endTime: row.endTime ?? "",
  }));

  dispatch(
    exportFile({
      fileName: "daily-report",
      format,
      columns,
      data,
    })
  );
};

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [
    employeeFilter,
    selectedDate,
  ]);


  const employeeOptions = useMemo(() => {
    const uniqueEmployees = Array.from(
      new Map(
        employees
          .filter((employee) => employee.employeeName)
          .map((employee) => [
            employee.employeeId,
            employee,
          ])
      ).values()
    );

    return [
      {
        value: "All Employees",
        label: "All Employees",
      },
      ...uniqueEmployees.map((employee) => ({
        value: employee.employeeName.trim(),
        label: employee.employeeName.trim(),
      })),
    ];
  }, [employees]);


  // -------------------------------------------------------
  // TABLE COLUMNS
  // -------------------------------------------------------

  const columns = useMemo(
    () => [
      {
        header: "Resource",
        accessorKey: "resourceName",

        cell: (info) => {
          const value =
            info.getValue();

          const row =
            info.row.original;

          return (
            <div className="flex items-center gap-3">
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-sm font-semibold text-foreground">
                  {value || "-"}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {row.department || "-"}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        header: "Task ID",
        accessorKey: "id",

        cell: (info) => (
          <span className="text-sm font-medium text-foreground">
            {info.getValue() ?? "-"}
          </span>
        ),
      },

      {
        header: "Task Title",
        accessorKey: "taskTitle",

        cell: (info) => {
          const row =
            info.row.original;

          return (
            <div className="space-y-2 w-[200px]">
              <p className="text-sm text-foreground">
                {info.getValue() || "-"}
              </p>

              <PriorityBadge
                value={row.priority}
              />
            </div>
          );
        },
      },

      {
        header: "Task Owner",
        accessorKey: "owner",

        cell: (info) => (
          <span className="text-sm text-foreground">
            {info.getValue() || "-"}
          </span>
        ),
      },

      {
        header: "Allocated Hours",
        accessorKey: "allocatedHours",

        cell: (info) => (
          <span className="text-sm font-semibold text-foreground">
            {info.getValue() ?? 0} hrs
          </span>
        ),
      },

      {
        header: "Client",
        accessorKey: "client",

        cell: (info) => (
          <span className="text-sm text-foreground">
            {info.getValue() || "-"}
          </span>
        ),
      },

      {
        header: "Project Title",
        accessorKey: "projectTitle",

        cell: (info) => {
          const row =
            info.row.original;

          return (
            <p className="text-sm text-foreground">
              <span className="inline-flex text-sm font-medium uppercase tracking-wide text-[#B91C1C]">
                {row.projectCode
                  ? `#${row.projectCode}`
                  : ""}
                &nbsp;
              </span>

              {info.getValue() || "-"}
            </p>
          );
        },
      },

      {
        header: "Start Time",
        accessorKey: "startTime",

        cell: (info) => (
          <span className="text-sm text-foreground">
            {info.getValue() || "-"}
          </span>
        ),
      },

      {
        header: "End Time",
        accessorKey: "endTime",

        cell: (info) => (
          <span className="text-sm text-foreground">
            {info.getValue() || "-"}
          </span>
        ),
      },
    ],
    []
  );


  // -------------------------------------------------------
  // TANSTACK TABLE
  // -------------------------------------------------------

  const table = useReactTable({
  data: filteredReports,
  columns,

  state: {
    sorting,
  },

  onSortingChange: setSorting,

  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});


  // -------------------------------------------------------
  // PAGINATION INFORMATION
  // -------------------------------------------------------

  const pageIndex = pagination.pageIndex;
const pageSize = pagination.pageSize;

const pageCount = totalPages || 0;
const totalItems = totalRecords || 0;

const startIndex =
  totalItems === 0
    ? 0
    : pageIndex * pageSize + 1;

const endIndex =
  totalItems === 0
    ? 0
    : Math.min(
        startIndex + apiReports.length - 1,
        totalItems
      );


  // -------------------------------------------------------
  // PAGE NUMBERS
  // -------------------------------------------------------

  const pageNumbers = useMemo(() => {
    if (pageCount <= 7) {
      return Array.from(
        { length: pageCount },
        (_, i) => i + 1
      );
    }

    const pages = [1];

    const left =
      Math.max(2, pageIndex);

    const right =
      Math.min(
        pageCount - 1,
        pageIndex + 2
      );

    if (left > 2) {
      pages.push("…");
    }

    for (
      let index = left;
      index <= right;
      index += 1
    ) {
      pages.push(index);
    }

    if (
      right <
      pageCount - 1
    ) {
      pages.push("…");
    }

    pages.push(pageCount);

    return pages;
  }, [
    pageCount,
    pageIndex,
  ]);


  // -------------------------------------------------------
  // LOADING
  // -------------------------------------------------------

  if (reportsLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading daily reports...
        </div>
      </div>
    );
  }


  // -------------------------------------------------------
  // ERROR
  // -------------------------------------------------------

  if (reportsError) {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-medium text-red-500">
          Failed to load daily reports.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {reportsError || "Something went wrong."}
        </p>
      </div>
    </div>
  );
}


  // -------------------------------------------------------
  // RETURN
  // -------------------------------------------------------

  return (
    <div className="space-y-4 p-4 sm:p-6">



      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

        <div className="flex flex-row items-center justify-between gap-4 px-5 py-4 flex-wrap md:flex-nowrap">


          <div className="flex items-center gap-3 w-full md:w-auto">

            <span className="text-sm font-medium text-muted-foreground">
              Search:
            </span>

            <div className="relative w-full sm:w-72">

              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
               type="text"
               value={searchInput}
               onChange={(e) => {
                 const value = e.target.value;
                 setSearchInput(value);

                 if (!value.trim()) {
                   setSearchQuery("");
                   setPagination((prev) => ({
                     ...prev,
                     pageIndex: 0,
                   }));
                 }
              }}
              placeholder="Search task, name, project"

              className="h-8 pl-9 text-sm border border-border rounded-lg w-full"
              />

            </div>

          </div>


          <div className="flex items-center gap-3 flex-shrink-0">

            <DatePicker
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);

                setPagination(
                  (prev) => ({
                    ...prev,
                    pageIndex: 0,
                  })
                );
              }}
              placeholder="Select date"
            />


            <ExportDropdown
  border="border-border"
  t={{
    cardBg: "bg-card",
    textPrimary: "text-foreground",
  }}
  isDark={isDark}
  showExport={showExport}
  setShowExport={setShowExport}

  handleCopy={async () => {
    const csv =
      table
        .getFilteredRowModel()
        .rows
        .map((row) => row.original)
        .map((row) => [
          row.resourceName,
          row.id,
          row.taskTitle,
          row.owner,
          row.allocatedHours,
          row.client,
          row.projectCode
            ? `${row.projectCode} - ${row.projectTitle}`
            : row.projectTitle,
          row.startTime,
          row.endTime,
        ])
        .map((row) =>
          row
            .map(
              (cell) =>
                `"${String(cell ?? "").replace(/"/g, '""')}"`
            )
            .join(",")
        )
        .join("\n");

    await navigator.clipboard.writeText(
      [
        "Resource,Task ID,Task Title,Task Owner,Allocated Hours,Client,Project Title,Start Time,End Time",
        csv,
      ].join("\n")
    );
  }}

  handlePrint={() => window.print()}

  handlePDF={() => handleExport("pdf")}

  handleCSV={() => handleExport("csv")}
/>

          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">


        {/* TABLE HEADER */}

        <div className="flex flex-row items-center justify-between gap-4 border-b border-border px-5 py-4 flex-wrap md:flex-nowrap">


          {/* EMPLOYEE FILTER */}

          <div className="w-full sm:w-64">

            <CustomSelect
              value={employeeFilter}
              onChange={(value) => {
                setEmployeeFilter(value);

                setPagination(
                  (prev) => ({
                    ...prev,
                    pageIndex: 0,
                  })
                );
              }}

              options={employeeOptions}

              placeholder="All Employees"
            />

          </div>


          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">

            <span>
              Show
            </span>

            <div className="rounded-lg border border-input bg-background">

              <CustomSelect

                value={String(pageSize)}

                onChange={(value) =>
                  setPagination(
                    (prev) => ({
                      ...prev,

                      pageSize:
                        Number(value),

                      pageIndex: 0,
                    })
                  )
                }

                options={[
                  {
                    value: "10",
                    label: "10",
                  },
                  {
                    value: "25",
                    label: "25",
                  },
                  {
                    value: "50",
                    label: "50",
                  },
                  {
                    value: "100",
                    label: "100",
                  },
                ]}
              />

            </div>

            <span>
              entries
            </span>

          </div>

        </div>


        {reportsLoading && (
  <div className="px-5 py-2 text-xs text-muted-foreground border-b border-border">
    Loading...
  </div>
)}


        <div className="overflow-x-auto">

          <Table className="min-w-full border-separate border-spacing-0 bg-white">

            <TableHeader>

              <TableRow className="bg-background">

                {table
                  .getHeaderGroups()[0]
                  .headers
                  .map((header) => (

                    <TableHead
                      key={header.id}

                      className="sticky top-0 z-10 bg-white px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                    >

                      {header.isPlaceholder
                        ? null
                        : (
                          <button
                            type="button"

                            onClick={
                              header.column
                                .getToggleSortingHandler()
                            }

                            className="inline-flex items-center gap-2"
                          >

                            {flexRender(
                              header.column
                                .columnDef
                                .header,

                              header.getContext()
                            )}

                            {header.column.getCanSort() ? (
                              <span className="flex flex-col text-[10px] text-muted-foreground">

                                <ChevronUp
                                  size={12}

                                  className={
                                    header.column.getIsSorted() ===
                                    "asc"
                                      ? "text-[#E12729]"
                                      : ""
                                  }
                                />

                                <ChevronDown
                                  size={12}

                                  className={
                                    header.column.getIsSorted() ===
                                    "desc"
                                      ? "text-[#E12729]"
                                      : ""
                                  }
                                />

                              </span>
                            ) : null}

                          </button>
                        )}

                    </TableHead>

                  ))}

              </TableRow>

            </TableHeader>


            <TableBody>

              {table.getRowModel().rows.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={
                      table.getAllColumns().length
                    }

                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    No records found.
                  </TableCell>

                </TableRow>

              ) : (

                table
                  .getRowModel()
                  .rows
                  .map((row) => (

                    <TableRow
                      key={row.id}
                      className="border-b last:border-b-0 hover:bg-muted/50"
                    >

                      {row
                        .getVisibleCells()
                        .map((cell) => (

                          <TableCell
                            key={cell.id}

                            className="px-4 py-4 align-middle text-sm text-foreground whitespace-normal"
                          >

                            {flexRender(
                              cell.column
                                .columnDef.cell,

                              cell.getContext()
                            )}

                          </TableCell>

                        ))}

                    </TableRow>

                  ))

              )}

            </TableBody>

          </Table>

        </div>



        <DataPagination
  page={pageIndex + 1}
  totalPages={pageCount}
  totalItems={totalItems}
  startIndex={startIndex}
  endIndex={endIndex}
  hasPrev={pageIndex > 0}
  hasNext={pageIndex < pageCount - 1}

  prevPage={() =>
    setPagination((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex - 1,
    }))
  }

  nextPage={() =>
    setPagination((prev) => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }))
  }

  goToPage={(page) =>
    setPagination((prev) => ({
      ...prev,
      pageIndex: page - 1,
    }))
  }

  pageNumbers={pageNumbers}
  className="border-t border-border"
/>

      </div>

    </div>
  );
}
