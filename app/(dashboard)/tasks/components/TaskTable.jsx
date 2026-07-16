"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TABLE_HEADERS = [
  { label: "Task ID", className: "w-20 text-center" },
  { label: "Task Title", className: "min-w-[240px]" },
  //   { label: "Project Title", className: "min-w-[240px]" },
  { label: "Employees", className: "w-76" },
  { label: "Project Code", className: "w-28 text-center" },
  { label: "Start Date", className: "w-78 text-center" },
  { label: "End Date", className: "w-28 text-center" },
  { label: "Actions", className: "w-28 text-center" },
];

export default function TaskTable({ rows = [] }) {
  return (
    <div className="border border-border bg-card ">
      <div className="max-h-[60vh] sm:max-h-[70vh] lg:max-h-[70vh] overflow-auto relative custom-scrollbar">
        <table className="w-full caption-bottom text-sm min-w-[860px]">
          <TableHeader className="bg-card/95">
            <TableRow className="bg-muted/100 hover:bg-muted/50">
              {TABLE_HEADERS.map((h) => (
                <TableHead
                  key={h.label}
                  className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sticky top-0 z-10 bg-muted ${h.className}`}
                >
                  {h.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_HEADERS.length} className="py-12 text-center text-muted-foreground">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((task) => <TaskTableRow key={task.id} task={task} />)
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}

function TaskTableRow({ task }) {
  return (
    <TableRow className="group border-b border-border transition-colors hover:bg-accent/30">
      <TableCell className="px-4 py-3 text-center text-sm font-medium text-foreground">
        <span className="inline-flex rounded-full  px-2 py-1 text-sm font-medium uppercase tracking-wide text-[#B91C1C]">
          #{task.id}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{task.title}</span>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${task.priority === "High"
                ? "bg-[#fee2e2] text-[#b91c1c]"
                : task.priority === "Medium"
                  ? "bg-[#fef3c7] text-[#92400e]"
                  : "bg-[#d1fae5] text-[#166534]"
              }`}
          >
            {task.priority}
          </span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{task.projectTitle}</div>
      </TableCell>
      <TableCell className="px-4 py-3 min-w-0">
        <div className="flex min-w-0 flex-wrap gap-2 max-w-[260px]">
          {(task.employees || []).map((employee) => (
            <span
              key={employee}
              className="inline-flex items-center rounded-full border border-[#B91C1C]  px-2.5 py-1 text-xs text-[#000] box-shadow: var(--shadow-sm);"
            >
              {employee}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-muted-foreground">{task.projectCode}</TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-muted-foreground">{task.startDate}</TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-muted-foreground">{task.endDate}</TableCell>
      <TableCell className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Button variant="ghost" size="icon-sm" aria-label="View task" className="opacity-60 group-hover:opacity-100 hover:text-[#E12729]">
            <Plus />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Edit task" className="opacity-60 group-hover:opacity-100 hover:text-[#E12729]">
            <Pencil />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Delete task" className="opacity-60 group-hover:opacity-100 hover:text-destructive">
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
