"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskRow from "./TaskRow";

const headers = [
  { label: "Task Name", accessor: "taskName" },
  { label: "Template Name", accessor: "templateName" },
  { label: "Responsibility", accessor: "responsibility" },
  { label: "Actual Hours", accessor: "actualHours" },
];

export default function TaskTable({ tasks, sortBy, sortDirection, onSort, onAddTask, pagination }) {
  const handleSort = (accessor) => {
    if (sortBy === accessor) {
      onSort(accessor, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSort(accessor, "asc");
    }
  };

  const renderSortIcon = (accessor) => {
    const active = sortBy === accessor;
    return (
      <span className="flex flex-col text-[10px] text-muted-foreground">
        <ChevronUp size={10} className={active && sortDirection === "asc" ? "text-foreground" : ""} />
        <ChevronDown size={10} className={active && sortDirection === "desc" ? "text-foreground" : ""} />
      </span>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-foreground">No tasks found</p>
        <p className="mt-2 text-sm text-muted-foreground">Create a template or adjust your filters to continue.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-[940px]">
          <TableHeader>
            <TableRow className="bg-muted/100">
              {headers.map((column) => (
                <TableHead
                  key={column.accessor}
                  className="sticky top-0 z-10 bg-card/95 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  <button
                    type="button"
                    onClick={() => handleSort(column.accessor)}
                    className="inline-flex items-center gap-2"
                  >
                    {column.label}
                    {renderSortIcon(column.accessor)}
                  </button>
                </TableHead>
              ))}
              <TableHead className="sticky top-0 z-10 bg-card/95 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                onAddTask={onAddTask}
                isStriped={index % 2 === 0}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination ? <div className="border-t border-border bg-card pb-3">{pagination}</div> : null}
    </div>
  );
}
