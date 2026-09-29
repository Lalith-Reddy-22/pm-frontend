"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskTemplates } from "@/store/slices/taskSlice";
import { usePagination } from "@/hooks/usePagination";
import DataPagination from "@/components/DataPagination";
import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import AddTaskDrawer from "../components/AddTaskDrawer";
import { TEMPLATE_OPTIONS } from "./constants";
import { filterTemplateTasks, sortTemplateTasks } from "./utils";

const PROJECT_OPTIONS = [
  { value: "", label: "--Select Project--" },
  { value: "Project Alpha", label: "Project Alpha" },
  { value: "Project Beta", label: "Project Beta" },
  { value: "Project Gamma", label: "Project Gamma" },
  { value: "Project Delta", label: "Project Delta" },
];

const initialTemplateForm = {
  name: "",
  department: "Marketing",
  description: "",
  status: "Active",
};

export default function TemplateTasksPage() {
  const dispatch = useDispatch();

const {
  taskTemplates,
  taskTemplatesLoading,
  taskTemplatesError,
} = useSelector((state) => state.task);

useEffect(() => {
  dispatch(fetchTaskTemplates());
}, [dispatch]);

  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddTaskDrawer, setShowAddTaskDrawer] = useState(false);

  const tasks = useMemo(() => {
  const mappedTasks = (taskTemplates || []).map((item) => ({
    id: item.taskId,
    taskId: item.taskId,
    templateId: item.tempId,
    taskName: item.taskName?.trim() || "",
    actualHours: item.actualHours?.trim() || "",
    responsibility: item.responsibility?.trim() || "",
    templateName: item.templateName?.trim() || "",
  }));

  console.log("========== RAW FIRST TASK ==========");
  console.log(taskTemplates?.[0]);
  console.log("RAW KEYS:", Object.keys(taskTemplates?.[0] || {}));

  console.log("========== TEMPLATE IDS ==========");
  console.log(
    [...new Set(mappedTasks.map((task) => task.templateId))]
  );

  return mappedTasks;
}, [taskTemplates]);

const filteredTasks = useMemo(
  () =>
    filterTemplateTasks(
      tasks,
      search,
      selectedTemplate
    ),
  [tasks, search, selectedTemplate]
);

const sortedTasks = useMemo(
  () =>
    sortTemplateTasks(
      filteredTasks,
      sortBy,
      sortDirection
    ),
  [filteredTasks, sortBy, sortDirection]
);

  const pagination = usePagination({ data: sortedTasks, pageSize: 10, initialPage: 1 });

  const handleSort = (column, direction) => {
    setSortBy(column);
    setSortDirection(direction);
  };


  const handleSearchChange = (value) => {
    setSearch(value);
    pagination.setPage(1);
  };

  const handleTemplateChange = (value) => {
    setSelectedTemplate(value);
    pagination.setPage(1);
  };

const handleAddTask = () => {
  setShowAddTaskDrawer(true);
};

const handleCloseDrawer = () => {
  setShowAddTaskDrawer(false);
};

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <TaskToolbar
          search={search}
          onSearchChange={handleSearchChange}
          selectedTemplate={selectedTemplate}
          templates={TEMPLATE_OPTIONS}
          onTemplateChange={handleTemplateChange}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
  {taskTemplatesLoading ? (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#E12729]" />

        <p className="text-sm text-gray-500">
          Loading task templates...
        </p>
      </div>
    </div>
  ) : taskTemplatesError ? (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-red-500">
        {taskTemplatesError}
      </p>
    </div>
  ) : (
    <TaskTable
      tasks={pagination.paginatedData}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSort={handleSort}
      onAddTask={handleAddTask}
      pagination={
        <DataPagination
          {...pagination}
          className="border-t border-border"
        />
      }
    />
  )}
</div>

      <AddTaskDrawer
  open={showAddTaskDrawer}
  onClose={handleCloseDrawer}
/>
    </div>
  );
}
