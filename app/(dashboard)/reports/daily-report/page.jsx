"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Upload,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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



const PRIORITY_STYLES = {
  Low: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-red-100 text-red-700",
  Critical: "bg-violet-100 text-violet-700",
};

const TASKS = [
  {
    id: 68262,
    taskTitle: "Gen-AI Team Meeting",
    resourceName: "Abhishek Badiger",
    department: "Tech Team",
    owner: "Akshaya K",
    allocatedHours: 0.5,
    client: "Internal",
    projectCode: "014",
    projectTitle: "Project Management",
    priority: "Medium",
    status: "INPROGRESS",
    startTime: "09:00 AM",
    endTime: "09:30 AM",
  },
  {
    id: 68263,
    taskTitle: "Client Kickoff Workshop",
    resourceName: "Priya Sharma",
    department: "Business Operations",
    owner: "Nikhil R",
    allocatedHours: 2,
    client: "Acme Corp",
    projectCode: "018",
    projectTitle: "Project Delivery",
    priority: "High",
    status: "ACTIVE",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
  },
  {
    id: 68264,
    taskTitle: "Design Review and Feedback",
    resourceName: "Sahil Jain",
    department: "Product Design",
    owner: "Meera Joshi",
    allocatedHours: 1.5,
    client: "Nova Labs",
    projectCode: "027",
    projectTitle: "Project Delivery",
    priority: "Low",
    status: "COMPLETED",
    startTime: "01:00 PM",
    endTime: "02:30 PM",
  },
  {
    id: 68265,
    taskTitle: "Sprint Planning Session",
    resourceName: "Rohit Patel",
    department: "Engineering",
    owner: "Anita Das",
    allocatedHours: 1,
    client: "Internal",
    projectCode: "014",
    projectTitle: "Project Management",
    priority: "Medium",
    status: "PENDING",
    startTime: "02:45 PM",
    endTime: "03:45 PM",
  },
  {
    id: 68266,
    taskTitle: "Budget Allocation Review",
    resourceName: "Sneha Verma",
    department: "Finance",
    owner: "Varun Mehta",
    allocatedHours: 0.75,
    client: "Internal",
    projectCode: "014",
    projectTitle: "Project Management",
    priority: "High",
    status: "ONHOLD",
    startTime: "04:00 PM",
    endTime: "04:45 PM",
  },
];

const EMPLOYEE_OPTIONS = [
  { value: "All Employees", label: "All Employees" },
  ...Array.from(new Set(TASKS.map((t) => t.resourceName))).map((name) => ({
    value: name,
    label: name,
  })),
];

function PriorityBadge({ value }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLES[value] ?? "bg-gray-100 text-gray-700"
        }`}
    >
      {value}
    </span>
  );
}

export default function DailyReportPage() {
  const { t, isDark } = useTheme();
  const [employeeFilter, setEmployeeFilter] = useState("All Employees");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const data = useMemo(
    () => TASKS.filter((task) => employeeFilter === "All Employees" || task.resourceName === employeeFilter),
    [employeeFilter]
  );

  const columns = useMemo(
    () => [
      {
        header: "Resource",
        accessorKey: "resourceName",
        cell: (info) => {
          const value = info.getValue();
          const row = info.row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-sm font-semibold text-foreground">{value}</p>
                <p className="truncate text-xs text-muted-foreground">{row.department}</p>
              </div>
            </div>
          );
        },
      },
      {
        header: "Task ID",
        accessorKey: "id",
      },
      {
        header: "Task Title",
        accessorKey: "taskTitle",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="space-y-2 w-[200px]">
              <p className="text-sm text-foreground">{info.getValue()}</p>
              <PriorityBadge value={row.priority} />
            </div>
          );
        },
      },
      {
        header: "Task Owner",
        accessorKey: "owner",
      },
      {
        header: "Allocated Hours",
        accessorKey: "allocatedHours",
        cell: (info) => <span className="text-sm font-semibold text-foreground">{info.getValue()} hrs</span>,
      },
      {
        header: "Client",
        accessorKey: "client",
      },
      {
        header: "Project Title",
        accessorKey: "projectTitle",
        cell: (info) => {
          const row = info.row.original;
          return (
            <p className="text-sm text-foreground">
              <span class="inline-flex text-sm font-medium uppercase tracking-wide text-[#B91C1C]">#{row.projectCode ? `${row.projectCode}` : ""} &nbsp;</span>{info.getValue()}
            </p>
          );
        },
      },
      {
        header: "Start Time",
        accessorKey: "startTime",
      },
      {
        header: "End Time",
        accessorKey: "endTime",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, columnId, filterValue) => {
      const orig = row.original;
      const target = [
        orig.id,
        orig.taskTitle,
        orig.resourceName,
        orig.department,
        orig.client,
        orig.projectCode,
        orig.projectTitle,
        orig.owner,
      ];
      return target.some((value) =>
        String(value).toLowerCase().includes(String(filterValue).toLowerCase())
      );
    },
    defaultColumn: {
      cell: (info) => <span>{info.getValue()}</span>,
    },
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilter, employeeFilter, selectedDate]);

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startIndex = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const endIndex = Math.min(totalItems, (pageIndex + 1) * pageSize);

  const pageNumbers = useMemo(() => {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages = [1];
    const left = Math.max(2, pageIndex);
    const right = Math.min(pageCount - 1, pageIndex + 2);
    if (left > 2) pages.push("…");
    for (let index = left; index <= right; index += 1) {
      pages.push(index);
    }
    if (right < pageCount - 1) pages.push("…");
    pages.push(pageCount);
    return pages;
  }, [pageCount, pageIndex]);

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4 px-5 py-4 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium text-muted-foreground">Search:</span>
            <div className="relative w-full sm:w-72">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setGlobalFilter(event.target.value);
                }}
                placeholder="Task ID, resource, owner..."
                className="h-10 pl-9 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <DatePicker value={selectedDate} onChange={setSelectedDate} placeholder="Select date" />
            <ExportDropdown
              border="border-border"
              t={{ cardBg: "bg-card", textPrimary: "text-foreground" }}
              isDark={isDark}
              showExport={showExport}
              setShowExport={setShowExport}
              handleCopy={async () => {
                const csv = table
                  .getFilteredRowModel()
                  .rows.map((row) => row.original)
                  .map((row) => [
                    row.resourceName,
                    row.id,
                    row.taskTitle,
                    row.owner,
                    row.allocatedHours,
                    row.client,
                    row.projectCode ? `${row.projectCode} - ${row.projectTitle}` : row.projectTitle,
                    row.startTime,
                    row.endTime,
                  ])
                  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                await navigator.clipboard.writeText(["Resource,Task ID,Task Title,Task Owner,Allocated Hours,Client,Project Title,Start Time,End Time", csv].join("\n"));
              }}
              handlePrint={() => window.print()}
              handlePDF={() => {
                const { jsPDF } = require("jspdf");
                const autoTable = require("jspdf-autotable");
                const doc = new jsPDF({ unit: "pt", format: "a4" });
                autoTable(doc, {
                  head: [[
                    "Resource",
                    "Task ID",
                    "Task Title",
                    "Task Owner",
                    "Hours",
                    "Client",
                    "Project Title",
                    "Start",
                    "End",
                  ]],
                  body: table.getFilteredRowModel().rows.map((row) => [
                    row.original.resourceName,
                    row.original.id,
                    row.original.taskTitle,
                    row.original.owner,
                    `${row.original.allocatedHours} hrs`,
                    row.original.client,
                    row.original.projectCode ? `${row.original.projectCode} - ${row.original.projectTitle}` : row.original.projectTitle,
                    row.original.startTime,
                    row.original.endTime,
                  ]),
                  styles: { fontSize: 9, cellPadding: 6 },
                  headStyles: { fillColor: [226, 36, 41] },
                  startY: 40,
                });
                doc.save("daily-report.pdf");
              }}
              handleCSV={() => {
                const rows = table.getFilteredRowModel().rows.map((row) => row.original);
                const csv = [
                  [
                    "Resource",
                    "Task ID",
                    "Task Title",
                    "Task Owner",
                    "Allocated Hours",
                    "Client",
                    "Project Title",
                    "Start Time",
                    "End Time",
                  ],
                  ...rows.map((row) => [
                    row.resourceName,
                    row.id,
                    row.taskTitle,
                    row.owner,
                    `${row.allocatedHours} hrs`,
                    row.client,
                    row.projectCode ? `${row.projectCode} - ${row.projectTitle}` : row.projectTitle,
                    row.startTime,
                    row.endTime,
                  ]),
                ]
                  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "daily-report.csv";
                link.click();
                URL.revokeObjectURL(url);
              }}
              handleExcel={() => {
                const rows = table.getFilteredRowModel().rows.map((row) => row.original);
                const csv = [
                  [
                    "Resource",
                    "Task ID",
                    "Task Title",
                    "Task Owner",
                    "Allocated Hours",
                    "Client",
                    "Project Title",
                    "Start Time",
                    "End Time",
                  ],
                  ...rows.map((row) => [
                    row.resourceName,
                    row.id,
                    row.taskTitle,
                    row.owner,
                    `${row.allocatedHours} hrs`,
                    row.client,
                    row.projectCode ? `${row.projectCode} - ${row.projectTitle}` : row.projectTitle,
                    row.startTime,
                    row.endTime,
                  ]),
                ]
                  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "application/vnd.ms-excel;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "daily-report.xls";
                link.click();
                URL.revokeObjectURL(url);
              }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4 border-b border-border px-5 py-4 flex-wrap md:flex-nowrap">
          <div className="min-w-[260px] w-full sm:w-auto">
            <Select
              value={employeeFilter}
              onValueChange={(value) => {
                setEmployeeFilter(value);
              }}
            >
              <SelectTrigger className="h-10 w-full sm:w-64 text-sm">
                <SelectValue placeholder="Employee" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
            <span>Show</span>
            <div className="rounded-lg border border-input bg-background">
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0,
                  }));
                }}
              >
                <SelectTrigger className="h-10 w-20 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span>entries</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-full border-separate border-spacing-0 bg-white">
            <TableHeader>
              <TableRow className="bg-background">
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-10 bg-white px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-2"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          <span className="flex flex-col text-[10px] text-muted-foreground">
                            <ChevronUp
                              size={12}
                              className={
                                header.column.getIsSorted() === "asc"
                                  ? "text-[#E12729]"
                                  : ""
                              }
                            />
                            <ChevronDown
                              size={12}
                              className={
                                header.column.getIsSorted() === "desc"
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
                  <TableCell colSpan={table.getAllColumns().length} className="py-16 text-center text-sm text-muted-foreground">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b last:border-b-0 hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-4 align-middle text-sm text-foreground whitespace-normal"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          hasPrev={table.getCanPreviousPage()}
          hasNext={table.getCanNextPage()}
          prevPage={() => table.previousPage()}
          nextPage={() => table.nextPage()}
          goToPage={(page) => table.setPageIndex(page - 1)}
          pageNumbers={pageNumbers}
          className="border-t border-border"
        />
      </div>
    </div>
  );
}
