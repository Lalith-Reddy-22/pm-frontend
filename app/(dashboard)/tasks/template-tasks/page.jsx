"use client";

import { useMemo, useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import DataPagination from "@/components/DataPagination";
import TaskToolbar from "./components/TaskToolbar";
import TaskTable from "./components/TaskTable";
import AddTaskDrawer from "./components/AddTaskDrawer";
import { TEMPLATE_TASKS } from "./data";
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
  const [tasks, setTasks] = useState(TEMPLATE_TASKS);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddTaskDrawer, setShowAddTaskDrawer] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");

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

  const handleAddTask = (task) => {
    setSelectedProject("");
    setShowAddTaskDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowAddTaskDrawer(false);
    setSelectedProject("");
  };

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleAddNewTask = () => {
    if (!selectedProject) return;

    const newTask = {
      id: `tpl-${tasks.length + 1}`,
      taskName: `New task for ${selectedProject}`,
      templateName: selectedTemplate === "all" ? "General" : selectedTemplate,
      responsibility: "AMD / MD",
      actualHours: 2,
    };

    setTasks((current) => [newTask, ...current]);
    handleCloseDrawer();
  };

  return (
    <div className="space-y-4 p-4 sm:p-4">
      <div>
        <div className="p-2">
          <TaskToolbar
            search={search}
            onSearchChange={handleSearchChange}
            selectedTemplate={selectedTemplate}
            templates={TEMPLATE_OPTIONS}
            onTemplateChange={handleTemplateChange}
          />
        </div>
      </div>

      <div>
        <div className="p-2">
          <TaskTable
            tasks={pagination.paginatedData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            onAddTask={handleAddTask}
            pagination={<DataPagination {...pagination} className="border-t border-border" />}
          />
        </div>
      </div>

      <AddTaskDrawer open={showAddTaskDrawer} onClose={handleCloseDrawer}>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Select Project
            </label>
            <select
              value={selectedProject}
              onChange={handleProjectChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              {PROJECT_OPTIONS.map((project) => (
                <option key={project.value} value={project.value}>
                  {project.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="inline-flex flex-1 justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              onClick={handleAddNewTask}
            >
              Add New Task
            </button>
            <button
              type="button"
              className="inline-flex flex-1 justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              onClick={handleCloseDrawer}
            >
              Cancel
            </button>
          </div>
        </div>
      </AddTaskDrawer>
    </div>
  );
}
