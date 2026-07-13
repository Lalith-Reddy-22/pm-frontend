"use client";

import { useMemo, useState } from "react";

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

export default function TasksPage() {
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SAMPLE_TASKS;

    return SAMPLE_TASKS.filter((task) =>
      [
        String(task.id),
        task.title,
        task.projectTitle,
        task.projectCode,
        task.priority,
        (task.employees || []).join(", "),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [search]);

  const pagination = usePagination({ data: filteredTasks, pageSize: 10 });

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <TaskToolbar search={search} setSearch={setSearch} setPage={pagination.setPage} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <TaskTable rows={pagination.paginatedData} />
        <TaskPagination {...pagination} />
      </div>
    </div>
  );
}
