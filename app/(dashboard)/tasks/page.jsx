"use client";

import { useMemo, useState } from "react";
import { parse, isWithinInterval, isValid } from "date-fns";

import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import TaskPagination from "./components/TaskPagination";
import { usePagination } from "@/hooks/usePagination";

const SAMPLE_TASKS = [
  {
    id: 356,
    title: "QA signoff and go live",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "High",
    employees: ["Keerthi MS", "Avinash Ranchagi" , "Prasanth K"],
    startDate: "04/13/2023",
    endDate: "04/13/2023",
  },
  {
    id: 355,
    title: "Addressing QA feedback",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Medium",
    employees: ["Keerthi MS"],
    startDate: "04/13/2023",
    endDate: "04/13/2023",
  },
  {
    id: 354,
    title: "QA of the final build",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "High",
    employees: ["Avinash Ranchagi"],
    startDate: "04/13/2023",
    endDate: "04/13/2023",
  },
  {
    id: 353,
    title: "Tech team updating model in build",
    projectTitle: "AMI LATAM LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Medium",
    employees: ["Keerthi MS"],
    startDate: "04/12/2023",
    endDate: "04/12/2023",
  },
  {
    id: 352,
    title: "Incorporating the Fat Pad Ageing changes",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Low",
    employees: ["Prasanth K"],
    startDate: "04/06/2023",
    endDate: "04/11/2023",
  },
  {
    id: 351,
    title: "Final regression testing",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Medium",
    employees: ["Keerthi MS"],
    startDate: "04/10/2023",
    endDate: "04/12/2023",
  },
  {
    id: 350,
    title: "Prepare release notes",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Low",
    employees: ["Avinash Ranchagi"],
    startDate: "04/08/2023",
    endDate: "04/09/2023",
  },
  {
    id: 349,
    title: "Client review meeting",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "High",
    employees: ["Keerthi MS"],
    startDate: "04/07/2023",
    endDate: "04/07/2023",
  },
  {
    id: 348,
    title: "Update asset library",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Low",
    employees: ["Prasanth K"],
    startDate: "04/05/2023",
    endDate: "04/05/2023",
  },
  {
    id: 347,
    title: "Monitor build stability",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Medium",
    employees: ["Avinash Ranchagi"],
    startDate: "04/04/2023",
    endDate: "04/06/2023",
  },
  {
    id: 356,
    title: "QA signoff and go live",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "High",
    employees: ["Keerthi MS", "Avinash Ranchagi"],
    startDate: "04/13/2023",
    endDate: "04/13/2023",
  },
  {
    id: 355,
    title: "Addressing QA feedback",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Medium",
    employees: ["Keerthi MS"],
    startDate: "04/13/2023",
    endDate: "04/13/2023",
  },
  {
    id: 354,
    title: "QA of the final build",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "High",
    employees: ["Avinash Ranchagi"],
    startDate: "04/13/2023",
    endDate: "04/13/2023",
  },
  {
    id: 353,
    title: "Tech team updating model in build",
    projectTitle: "AMI LATAM LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Medium",
    employees: ["Keerthi MS"],
    startDate: "04/12/2023",
    endDate: "04/12/2023",
  },
  {
    id: 352,
    title: "Incorporating the Fat Pad Ageing changes",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Low",
    employees: ["Prasanth K"],
    startDate: "04/06/2023",
    endDate: "04/11/2023",
  },
  {
    id: 351,
    title: "Final regression testing",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Medium",
    employees: ["Keerthi MS"],
    startDate: "04/10/2023",
    endDate: "04/12/2023",
  },
  {
    id: 350,
    title: "Prepare release notes",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Low",
    employees: ["Avinash Ranchagi"],
    startDate: "04/08/2023",
    endDate: "04/09/2023",
  },
  {
    id: 349,
    title: "Client review meeting",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "High",
    employees: ["Keerthi MS"],
    startDate: "04/07/2023",
    endDate: "04/07/2023",
  },
  {
    id: 348,
    title: "Update asset library",
    projectTitle: "AMI LATAM 3D Face Ageing Module",
    projectCode: "0737",
    priority: "Low",
    employees: ["Prasanth K"],
    startDate: "04/05/2023",
    endDate: "04/05/2023",
  },
];

// Parse date string "MM/dd/yyyy" → Date
function parseMDY(str) {
  if (!str) return undefined;
  const d = parse(str, "MM/dd/yyyy", new Date());
  return isValid(d) ? d : undefined;
}

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const { from, to } = dateRange;
    const hasRange = from || to;

    return SAMPLE_TASKS.filter((task) => {
      // ── Text search ──
      if (query) {
        const matches = [
          String(task.id),
          task.title,
          task.projectTitle,
          task.projectCode,
          task.priority,
          (task.employees || []).join(", "),
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // ── Date range filter (against task startDate) ──
      if (hasRange) {
        const taskStart = parseMDY(task.startDate);
        const taskEnd   = parseMDY(task.endDate);
        const rangeFrom = from ?? new Date(0);
        const rangeTo   = to   ?? new Date(8640000000000000);
        // Keep task if startDate OR endDate falls within the selected range
        const startInRange = taskStart && isWithinInterval(taskStart, { start: rangeFrom, end: rangeTo });
        const endInRange   = taskEnd   && isWithinInterval(taskEnd,   { start: rangeFrom, end: rangeTo });
        if (!startInRange && !endInRange) return false;
      }

      return true;
    });
  }, [search, dateRange]);

  const pagination = usePagination({ data: filteredTasks, pageSize: 10 });

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="overflow-visible rounded-xl border border-border bg-card shadow-sm">
        <TaskToolbar
          search={search}
          setSearch={setSearch}
          setPage={pagination.setPage}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <TaskTable rows={pagination.paginatedData} />
        <TaskPagination {...pagination} />
      </div>
    </div>
  );
}
