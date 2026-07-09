"use client";

import { useState } from "react";

import ProjectToolbar from "./components/ProjectToolbar";
import ProjectTable from "./components/ProjectTable";
import ProjectPagination from "./components/Projectpagination";
import AddProjectModal from "./components/AddProjectModal";
import ProjectGrid from "./components/ProjectGrid";

export default function ProjectPage() {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("list");

  return (
  <div className="space-y-4 p-6">

    {/* Add Project Button */}
    <div className="flex justify-end">
      <button
        onClick={() => setShowAddModal(true)}
        className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600">
        + Add Project
      </button>
    </div>

    {/* White Card */}
    <div className="overflow-hidden rounded-xl bg-white">

      <ProjectToolbar
  search={search}
  setSearch={setSearch}
  pageSize={pageSize}
  setPageSize={setPageSize}
  setPage={setPage}
  view={view}
  setView={setView}
/>

      {view === "list" ? (
  <ProjectTable
    search={search}
    page={page}
    pageSize={pageSize}
  />
) : (
  <ProjectGrid />
)}

      <ProjectPagination
        page={page}
        setPage={setPage}
      />
    </div>

    <AddProjectModal
      open={showAddModal}
      onClose={() => setShowAddModal(false)}
    />
  </div>
);
}