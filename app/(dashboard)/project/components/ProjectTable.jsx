"use client";

import { useMemo } from "react";
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
import { useRouter } from "next/navigation";

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
  const role = useMemo(() => {
    if (typeof window === "undefined") return "admin";
    return sessionStorage.getItem("role") || "admin";
  }, []);

  return (
    <div className="overflow-auto relative max-h-[60vh] sm:max-h-[70vh] lg:max-h-[70vh] custom-scrollbar">
      <table className="w-full caption-bottom text-sm min-w-[960px]">
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
              <TableCell
                colSpan={TABLE_HEADERS.length}
                className="py-12 text-center text-muted-foreground"
              >
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((project, idx) => (
              <ProjectTableRow key={project.id ?? idx} project={project} role={role} />
            ))
          )}
        </TableBody>
      </table>
    </div>
  );
}

function ProjectTableRow({ project, role }) {
  const router = useRouter();

  return (
    <TableRow className="group border-b border-border transition-colors hover:bg-accent/30 ">


      {/* Project Name + Client */}
      <TableCell
  onClick={() => router.push(`/project/${project.id}`)}
  className="px-6 py-2 cursor-pointer"
>
  {/* Project Name */}
  <div className="flex items-center gap-2">
    {/* Client Initial */}
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFDAD5] shrink-0">
      <p className="text-[#FF3B30] font-semibold">
        {(project.client || "P").charAt(0).toUpperCase()}
      </p>
    </div>

    {/* Project Name */}
    <p className="font-semibold text-foreground leading-snug">
      {project.name ?? "—"}
    </p>
  </div>

  {/* Client + Project Code Badge */}
  <div className="flex items-center gap-2 mt-1">
    
    <span className="text-sm text-muted-foreground font-medium">
      Client: {project.client ?? "—"}
    </span>

    {/* Project Code Badge */}
    <span className="text-xs text-[#E12729] border border-[#E12729] bg-transparent rounded-full inline-flex items-center justify-center px-2.5 py-0.5">
  {project.projectCode ?? "—"}
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
        {role !== "pm_employee" && (
          <div className="flex items-center justify-center gap-1.5">
            <Button
  variant="ghost"
  size="icon-sm"
  aria-label="Edit project"
  className="opacity-60 group-hover:opacity-100 hover:text-[#E12729]"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    // alert("PROJECT ID = " + project.id);

    console.log("========== EDIT ==========");
    console.log("PROJECT OBJECT:", project);
    console.log("PROJECT ID:", project.id);
    console.log("==========================");

    router.push(`/finance/project-lists/${project.id}/edit?from=project`);
  }}
>
  <Pencil />
</Button>
            {/* <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Delete project"
              className="opacity-60 group-hover:opacity-100 hover:text-destructive"
            >
              <Trash2 />
            </Button> */}
          </div>
        )}
      </TableCell>
    </TableRow>

  );
}