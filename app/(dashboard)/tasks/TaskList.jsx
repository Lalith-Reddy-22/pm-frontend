"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { parse, isWithinInterval, isValid } from "date-fns";

import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import TaskPagination from "./components/TaskPagination";
import { usePagination } from "@/hooks/usePagination";
import AddTaskDrawer from "./components/AddTaskDrawer";

// Parse date string "MM/dd/yyyy" → Date
function parseMDY(str) {
  if (!str) return undefined;
  const d = parse(str, "MM/dd/yyyy", new Date());
  return isValid(d) ? d : undefined;
}

export default function TaskList({ tasks, showBackButton = false, }) {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(today);
    mon.setDate(today.getDate() + diff);
    mon.setHours(0, 0, 0, 0);
    const fri = new Date(mon);
    fri.setDate(mon.getDate() + 4);
    return { from: mon, to: fri };
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const { from, to } = dateRange;
    const hasRange = from || to;

    return tasks.filter((task) => {
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

      // ── Date range filter (against task startDate / endDate) ──
      if (hasRange) {
        const taskStart = parseMDY(task.startDate);
        const taskEnd = parseMDY(task.endDate);
        const rangeFrom = from ?? new Date(0);
        const rangeTo = to ?? new Date(8640000000000000);
        // Keep task if startDate OR endDate falls within the selected range
        const startInRange = taskStart && isWithinInterval(taskStart, { start: rangeFrom, end: rangeTo });
        const endInRange = taskEnd && isWithinInterval(taskEnd, { start: rangeFrom, end: rangeTo });
        if (!startInRange && !endInRange) return false;
      }

      return true;
    });
  }, [tasks, search, dateRange]);

  const pagination = usePagination({ data: tasks, pageSize: 10 });

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
      <div className="rounded-xl border border-border bg-card shadow-sm">

        <TaskToolbar
          search={search}
          setSearch={setSearch}
          setPage={pagination.setPage}
          dateRange={dateRange}
          setDateRange={setDateRange}
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