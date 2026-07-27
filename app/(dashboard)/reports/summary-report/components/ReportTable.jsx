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
  return (
    <TableRow className="border-b transition-colors hover:bg-accent/30">
      {REPORT_COLUMNS.map((column) => {
        switch (column.key) {
          case "project":
            return (
              <TableCell
                key={column.key}
                className={`px-6 py-3 align-middle ${column.className}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {row.projectTitle}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-xs">

                    <span className="truncate text-gray-500">
                      {row.client}
                    </span>

                    <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-[#E12729] border border-[#E12729]">
                      #{row.projectCode}
                    </span>
                  </div>
                </div>
              </TableCell>
            );

          case "task":
            return (
              <TableCell
                key={column.key}
                className={`px-6 py-3 align-middle ${column.className}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {row.taskTitle}
                  </p>

                  <div className="mt-2">
  <span className="inline-flex items-center rounded-md border border-[#E12729] bg-white px-2 py-1 text-[11px] font-semibold text-[#E12729]">
    #{row.taskId}
  </span>
</div>
                </div>
              </TableCell>
            );

          case "employee":
            return (
              <TableCell
                key={column.key}
                className={`px-6 py-3 align-middle ${column.className}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {row.employeeName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {row.designation}
                  </p>
                </div>
              </TableCell>
            );

          default:
            return (
              <TableCell
                key={column.key}
                className={`px-6 py-3 align-middle ${column.className}`}
              >
                {column.render
                  ? column.render(row[column.key])
                  : row[column.key] ?? "—"}
              </TableCell>
            );
        }
      })}
    </TableRow>
  );
}