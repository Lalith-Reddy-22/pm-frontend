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

export default function ReportTable({
  rows = [],
  emptyMessage = "No records found",
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="overflow-auto relative max-h-[60vh] sm:max-h-[70vh] lg:max-h-[70vh]">
        <table className="w-full caption-bottom text-sm min-w-full">
          <TableHeader className="bg-card/95">
            <TableRow className="bg-muted/100 hover:bg-muted/50">
              {REPORT_COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sticky top-0 z-10 bg-muted ${column.className}`}
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
                className="py-12 text-center text-muted-foreground"
              >
                <div className="flex justify-center items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E12729] border-t-transparent"></div>
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
    <div className="overflow-auto relative max-h-[60vh] sm:max-h-[70vh] lg:max-h-[70vh] custom-scrollbar">
      <table className="w-full caption-bottom text-sm min-w-full">
        <TableHeader className="bg-card/95">
          <TableRow className="bg-muted/100 hover:bg-muted/50">
            {REPORT_COLUMNS.map((column) => (
              <TableHead
                key={column.key}
                className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sticky top-0 z-10 bg-muted ${column.className}`}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  <div className="flex flex-col gap-0.5">
                    <ChevronUp size={12} className="text-muted-foreground opacity-50 leading-none" />
                    <ChevronDown size={12} className="text-muted-foreground opacity-50 leading-none" />
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
            rows.map((row, idx) => (
              <ReportTableRow key={row.id ?? idx} row={row} />
            ))
          )}
        </TableBody>
      </table>
    </div>
  );
}

function ReportTableRow({ row }) {
  return (
    <TableRow className="group border-b border-border transition-colors hover:bg-accent/30">
      {REPORT_COLUMNS.map((column) => (
        <TableCell
          key={column.key}
          className={`px-6 py-3 text-sm text-foreground ${column.className}`}
        >
          {column.render ? column.render(row[column.key]) : row[column.key] ?? "—"}
        </TableCell>
      ))}
    </TableRow>
  );
}
