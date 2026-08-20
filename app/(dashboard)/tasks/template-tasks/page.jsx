"use client";

import { useMemo, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import DataPagination from "@/components/DataPagination";
import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import AddTaskDrawer from "../components/AddTaskDrawer";
import { TEMPLATE_OPTIONS } from "./constants";
import { TEMPLATE_TASKS } from "./data";
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
  const [tasks, setTasks] = useState(TEMPLATE_TASKS);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddTaskDrawer, setShowAddTaskDrawer] = useState(false);

  const filteredTasks = useMemo(
    () => filterTemplateTasks(tasks, search, selectedTemplate),
    [tasks, search, selectedTemplate]
  );

  const sortedTasks = useMemo(
    () => sortTemplateTasks(filteredTasks, sortBy, sortDirection),
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
