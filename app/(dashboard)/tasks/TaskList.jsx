"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import TaskPagination from "./components/TaskPagination";
import { usePagination } from "@/hooks/usePagination";
import AddTaskDrawer from "./components/AddTaskDrawer";

export default function TaskList({ tasks, showBackButton=false, }) {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tasks;

    return tasks.filter((task) =>
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
  }, [tasks,search]);

  const pagination = usePagination({ data: filteredTasks, pageSize: 10 });

  return (
    <div className="space-y-4 p-4 sm:p-6">

        {showBackButton && (
  <div className="mb-4">
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm font-medium text-[#E12729] cursor-pointer"
    >
      <ArrowLeft size={18} />
      Back to Projects
    </button>
  </div>
)}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        
<TaskToolbar
  search={search}
  setSearch={setSearch}
  setPage={pagination.setPage}
  onAddTask={() => setOpenDrawer(true)}
/>

     </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <TaskTable rows={pagination.paginatedData} />
        <TaskPagination {...pagination} />
      </div>

      <AddTaskDrawer
  open={openDrawer}
  onClose={() => setOpenDrawer(false)}
/>
    </div>

    
  );
}