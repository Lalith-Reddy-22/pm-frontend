"use client";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function EmployeeTable({
  rows = [],
  emptyMessage = "No employees found",
  isLoading = false,
  onViewEmployee,
}) {
  if (isLoading) {
    return (
      <div className="overflow-auto relative max-h-[60vh] sm:max-h-[70vh] lg:max-h-[70vh]">
        <table className="w-full caption-bottom text-sm min-w-full">
          <TableHeader className="bg-card/95">
            <TableRow className="bg-muted/100 hover:bg-muted/50">
              <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sticky top-0 z-10 bg-muted w-12">
              <div className="flex items-center justify-center gap-1">                  <Plus size={14} />
                </div>
              </TableHead>
<TableHead
  className="px-6 py-3 text-xs  font-semibold uppercase tracking-wide text-muted-foreground sticky top-0 z-10 bg-muted min-w-[200px]"
>              <div className="flex items-center justify-center  gap-1">
                      Employee Name
                  {/* <div className="flex flex-col gap-0.5">
                    <ChevronUp size={12} className="text-muted-foreground opacity-50 leading-none" />
                    <ChevronDown size={12} className="text-muted-foreground opacity-50 leading-none" />
                  </div> */}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} className="py-12 text-center text-muted-foreground">
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

  console.log(
  "EMPLOYEE TABLE ROWS:",
  rows.map((row, index) => ({
    index,
    id: row.id,
    name: row.name,
    emp_ID: row.emp_ID,
    Emp_ID: row.Emp_ID,
  }))
);

const duplicateIds = rows
  .map((row) => row.id)
  .filter((id, index, arr) => arr.indexOf(id) !== index);

console.log("DUPLICATE IDS IN EMPLOYEE TABLE:", duplicateIds);

  return (
    <div className="overflow-auto relative max-h-[60vh] sm:max-h-[70vh] lg:max-h-[70vh] custom-scrollbar">
      <table className="w-full caption-bottom text-sm min-w-full">
        <TableHeader className="bg-card/95">
          <TableRow className="bg-muted/100 hover:bg-muted/50">
            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground sticky top-0 z-10 bg-muted w-12">
  <div className="flex items-center justify-center gap-1">
                {/* <Plus size={14} /> */}
                {/* <ChevronUp size={12} className="text-muted-foreground opacity-50 leading-none" />
                  <ChevronDown size={12} className="text-muted-foreground opacity-50 leading-none" /> */}
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground sticky top-0 z-10 bg-muted w-12">
  <div className="flex items-center justify-center gap-1">
                Employee Name
                {/* <div className="flex flex-col gap-0.5">
                  <ChevronUp size={12} className="text-muted-foreground opacity-50 leading-none" />
                  <ChevronDown size={12} className="text-muted-foreground opacity-50 leading-none" />
                </div> */}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="py-12 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, idx) => (
              <TableRow
  key={row.id ?? idx}
  className="group border-b border-border transition-colors hover:bg-accent/30"
>
                <TableCell className="px-6 py-3 text-center text-sm text-foreground w-12">
                  <button
  type="button"
  onClick={() => {
    console.log("PLUS CLICKED");
    console.log("EMPLOYEE ROW:", row);

    if (onViewEmployee) {
      onViewEmployee(row);
    } else {
      console.error("onViewEmployee is NOT provided");
    }
  }}
  className="relative z-50 cursor-pointer rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
>
  <Plus size={16} />
</button>
                </TableCell>
                <TableCell className="px-6 py-3 text-center text-sm font-medium text-foreground">
                {row.name}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </table>
    </div>
  );
}
