"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { REPORT_COLUMNS } from "./columns";

const TYPE_COLORS = {
  Development: "bg-blue-100 text-blue-800",
  Design: "bg-purple-100 text-purple-800",
  Testing: "bg-orange-100 text-orange-800",
  Analysis: "bg-green-100 text-green-800",
  Documentation: "bg-gray-100 text-gray-800",
  Review: "bg-pink-100 text-pink-800",
  Deployment: "bg-indigo-100 text-indigo-800",
};

export default function ReportTable({
  rows = [],
  emptyMessage = "No records found",
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="relative max-h-[70vh] overflow-auto">
        <table className="w-full min-w-full text-sm">
          <TableHeader className="bg-card/95">
            <TableRow className="bg-muted">
              {REPORT_COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  className={`sticky top-0 z-10 bg-muted px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${column.className}`}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell
                colSpan={REPORT_COLUMNS.length}
                className="py-12 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E12729] border-t-transparent"></div>
                  Loading...
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </table>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar relative max-h-[70vh] overflow-auto">
      <table className="w-full min-w-full text-sm">
        <TableHeader className="bg-card/95">
          <TableRow className="bg-muted">
            {REPORT_COLUMNS.map((column) => (
              <TableHead
                key={column.key}
                className={`sticky top-0 z-10 bg-muted px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${column.className}`}
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>

                  <div className="flex flex-col">
                    <ChevronUp
                      size={12}
                      className="text-muted-foreground opacity-50"
                    />
                    <ChevronDown
                      size={12}
                      className="-mt-1 text-muted-foreground opacity-50"
                    />
                  </div>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={REPORT_COLUMNS.length}
                className="py-12 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <ReportTableRow
                key={row.id ?? index}
                row={row}
              />
            ))
          )}
        </TableBody>
      </table>
    </div>
  );
}

function ReportTableRow({ row }) {

  const tableRow = {
  // PROJECT
  projectTitle:
    row.project_Title ??
    row.projectTitle ??
    row.Project_Title ??
    row.ProjectTitle ??
    "",

  projectCode:
    row.projectCode ??
    row.project_Code ??
    "",

  // CLIENT
  client:
    row.client_Title ??
    row.Client_Title ??
    row.client ??
    "",

  // SUB CLIENT
  subClient:
    row.sub_Client_Name ??
    row.Sub_Client_Name ??
    row.subClient ??
    "",

  // TASK
  taskTitle:
    row.task_Title ??
    row.Task_Title ??
    row.TaskTitle ??
    row.taskTitle ??
    "",

  taskId:
    row.task_ID ??
    row.Task_ID ??
    row.Task_id ??
    row.taskId ??
    "",

  // TYPE
  type:
  Number(row.billing_type) === 0
    ? "Non-Billable"
    : "Billable",

  // DATES
  startDate:
    row.startDate ??
    row.StartDate ??
    "",

  endDate:
    row.endDate ??
    row.EndDate ??
    "",

  // EMPLOYEE
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

  // FUNCTION
  function:
    row.teams_Name ??
    row.Teams_Name ??
    row.Function_Name ??
    row.functionName ??
    row.function ??
    "",

  // HOURS
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

  // COST
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
    Number(row.actual_Cost ?? row.Actual_Cost ?? 0) -
    Number(row.planned_Cost ?? row.Planned_Cost ?? 0),
};

  return (
    <TableRow className="border-b transition-colors hover:bg-accent/30">

      {REPORT_COLUMNS.map((column) => {

        return (
          <TableCell
            key={column.key}
            className={`px-6 py-3 align-middle ${column.className}`}
          >
            {column.render
              ? column.render(tableRow[column.key])
              : tableRow[column.key] ?? "—"}
          </TableCell>
        );

      })}

    </TableRow>
  );
}