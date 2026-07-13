"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TABLE_HEADERS = [
  { label: "Project Name", className: "min-w-[220px]" },
  { label: "Start Date", className: "w-28 text-center" },
  { label: "End Date", className: "w-28 text-center" },
  { label: "Status", className: "w-[150px] text-center" },
  { label: "Outsource Value", className: "w-36 text-right" },
  { label: "Total PO Value", className: "w-36 text-right" },
  { label: "Actions", className: "w-24 text-center" },
];

export default function ProjectTable({ rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/100 hover:bg-muted/50">
            {TABLE_HEADERS.map((h) => (
              <TableHead
                key={h.label}
                className={`px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${h.className}`}
              >
                {h.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={TABLE_HEADERS.length}
                className="py-12 text-center text-muted-foreground"
              >
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((project, idx) => (
              <ProjectTableRow key={project.id ?? idx} project={project} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ProjectTableRow({ project }) {
  return (
    <TableRow className="group border-b border-border transition-colors hover:bg-accent/30 ">


      {/* Project Name + Client */}
      <TableCell className="px-6 py-2">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFDAD5]">
            <p className="text-[#FF3B30] font-semibold">{project.client.charAt(0).toUpperCase()}</p>
          </div>
          <p className="font-semibold text-foreground leading-snug">
            {project.name ?? "—"}
          </p>
        </div>
        <div className="flex gap-1 items-center">
          {project.client && (
            <span className="mt-0.5 text-sm text-muted-foreground mr-1 font-medium">
              Client: {project.client}
            </span>
          )}
          {/* Create Date */}
          <span className="mt-1 text-xs text-muted-foreground border border-border bg-muted/30 rounded-full inline-flex items-center justify-center px-2.5 py-0.5">
            {project.createDate ?? "—"}
          </span>
        </div>
      </TableCell>

      {/* Start Date */}
      <TableCell className="px-4 py-3 text-center text-sm text-muted-foreground">
        {project.startDate ?? "—"}
      </TableCell>

      {/* End Date */}
      <TableCell className="px-4 py-3 text-center text-sm text-muted-foreground">
        {project.endDate ?? "—"}
      </TableCell>

      {/* Status */}
      <TableCell className="px-4 py-3 text-center">
        <StatusBadge status={project.status} />
      </TableCell>

      {/* Outsource Value */}
      <TableCell className="px-4 py-3 text-right text-sm">
        {project.outsourceValue ?? "$0.00"}
      </TableCell>

      {/* Total PO Value */}
      <TableCell className="px-4 py-3 text-right text-sm font-medium text-foreground">
        {project.totalPOValue ?? "$0.00"}
      </TableCell>


      {/* Actions */}
      <TableCell className="px-4 py-3">
        <div className="flex items-center justify-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit project"
            className="opacity-60 group-hover:opacity-100 hover:text-[#E12729]"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete project"
            className="opacity-60 group-hover:opacity-100 hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>

  );
}