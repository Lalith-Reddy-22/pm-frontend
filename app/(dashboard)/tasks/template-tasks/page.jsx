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
  return (taskTemplates || []).map((item) => ({
    id: item.taskId,
    taskId: item.taskId,
    templateId: item.tempId,
    taskName: item.taskName?.trim() || "",
    actualHours: item.actualHours?.trim() || "",
    responsibility: item.responsibility?.trim() || "",
    templateName: item.templateName?.trim() || "",
  }));
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

if (taskTemplatesLoading) {
  return (
    <div className="p-6">
      Loading task templates...
    </div>
  );
}

if (taskTemplatesError) {
  return (
    <div className="p-6 text-red-500">
      {taskTemplatesError}
    </div>
  );
}

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
        <TaskTable
          tasks={pagination.paginatedData}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          onAddTask={handleAddTask}
          pagination={<DataPagination {...pagination} className="border-t border-border" />}
        />
      </div>

      <AddTaskDrawer
  open={showAddTaskDrawer}
  onClose={handleCloseDrawer}
/>
    </div>
  );
}
