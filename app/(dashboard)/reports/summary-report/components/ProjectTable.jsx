"use client";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProjectTable({
  rows = [],
  isLoading = false,
  emptyMessage = "No projects found",
  onViewProject,
}) {
  if (isLoading) {
    return (
      <div className="overflow-auto max-h-[60vh]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-12 text-center">
                <Plus size={14} />
              </TableHead>

              <TableHead>
                <div className="flex items-center justify-center gap-1">
                  Project Title
                  {/* <div className="flex flex-col">
                    <ChevronUp size={12} />
                    <ChevronDown size={12} />
                  </div> */}
                </div>
              </TableHead>

              <TableHead>
                <div className="flex items-center justify-center gap-1">
                  Project Code
                  {/* <div className="flex flex-col">
                    <ChevronUp size={12} />
                    <ChevronDown size={12} />
                  </div> */}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
  <TableRow key="loading-projects">
              <TableCell
                colSpan={3}
                className="py-10 text-center text-muted-foreground"
              >
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[60vh] custom-scrollbar">
      <Table>

        <TableHeader className="sticky top-0 bg-white z-20">

          <TableRow className="bg-muted">

            <TableHead className="w-12 text-center">
              {/* <Plus size={14} /> */}
            </TableHead>

            <TableHead className="min-w-[450px]">
              <div className="flex items-center justify-center gap-1">
                Project Title
                {/* <div className="flex flex-col">
                  <ChevronUp size={12} />
                  <ChevronDown size={12} />
                </div> */}
              </div>
            </TableHead>

            <TableHead className="min-w-[180px]">
              <div className="flex items-center justify-center gap-1">
                Project Code
                {/* <div className="flex flex-col">
                  <ChevronUp size={12} />
                  <ChevronDown size={12} />
                </div> */}
              </div>
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {rows.length === 0 ? (
  <TableRow key="empty-projects">
    <TableCell
      colSpan={3}
      className="py-10 text-center text-muted-foreground"
    >
      {emptyMessage}
    </TableCell>
  </TableRow>
) : (
           rows.map((row, index) => (
  <TableRow
    key={
      row.projectId ??
      row.project_ID ??
      row.project_Id ??
      row.id ??
      row.project_Code ??
      index
    }
    className="hover:bg-muted/40"
  >
                <TableCell className="text-center">

                  <button
                    onClick={() => onViewProject(row)}
                    className="rounded p-1 hover:bg-muted"
                  >
                    <Plus size={16} />
                  </button>

                </TableCell>

                <TableCell className="text-center align-middle">
  {row.projectTitle ??
    row.project_Title ??
    row.Project_Title ??
    row.project_title ??
    "—"}
</TableCell>

                <TableCell className="text-center align-middle">
  {row.projectCode ??
    row.project_Code ??
    row.Project_Code ??
    "—"}
</TableCell>

              </TableRow>
            ))
          )}

        </TableBody>

      </Table>
    </div>
  );
}