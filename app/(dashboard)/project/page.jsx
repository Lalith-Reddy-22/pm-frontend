"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectToolbar from "./components/ProjectToolbar";
import ProjectTable from "./components/ProjectTable";
import ProjectPagination from "./components/Projectpagination";
import AddProjectModal from "./components/AddProjectModal";
import ProjectGrid from "./components/ProjectGrid";
import { fetchProjects } from "@/store/slices/projectSlice";
import { format } from "date-fns";
import { exportFile } from "@/store/slices/exportSlice";

export default function ProjectPage() {
  const dispatch = useDispatch();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const {
    projects,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
  } = useSelector((state) => state.project);

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("list");

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  useEffect(() => {
    dispatch(
      fetchProjects({
        searchText: search,
        pageNumber: pageNumber,
        pageSize: pageSize,
      })
    );
  }, [dispatch, search, pageNumber, pageSize]);

  // =====================================================
  // SEARCH
  // =====================================================

 const handleSearchChange = (value) => {
  setSearch(value);
};


const handleProjectExport = async (exportFormat = "csv") => {
  try {
    const exportData = projects.map((project) => ({
      projectCode: project.projectCode || "",
      projectTitle: project.projectTitle || "",
      client: project.client || "",
    }));

    await dispatch(
      exportFile({
        fileName: `project-list-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          {
            key: "projectCode",
            header: "Project Code",
          },
          {
            key: "projectTitle",
            header: "Project Title",
          },
          {
            key: "client",
            header: "Client",
          },
        ],
        data: exportData,
      })
    ).unwrap();
  } catch (error) {
    console.error("PROJECT EXPORT ERROR:", error);
  }
};
  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const handlePageChange = (newPage) => {
  dispatch({
    type: "project/setPageNumber",
    payload: newPage,
  });
};

  // =====================================================
  // PAGE SIZE CHANGE
  // =====================================================

  const handlePageSizeChange = (newPageSize) => {
    dispatch(
      fetchProjects({
        searchText: search,
        pageNumber: 1,
        pageSize: newPageSize,
      })
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && projects.length === 0) {
    return (
      <div className="p-6">
        Loading projects...
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && projects.length === 0) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-4 p-4 sm:p-6">

      {/* ===============================================
          TOOLBAR
      =============================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

        <ProjectToolbar
          search={search}
          setSearch={handleSearchChange}
          pageSize={pageSize}
          setPageSize={handlePageSizeChange}
          setPage={handlePageChange}
          view={view}
          setView={setView}
          onExport={handleProjectExport}
        />

      </div>


      {/* ===============================================
          TABLE / GRID
      =============================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

        {view === "list" ? (
          <ProjectTable rows={projects} />
        ) : (
          <ProjectGrid projects={projects} />
        )}

        {/* =============================================
            PAGINATION
        ============================================= */}

        <ProjectPagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

      </div>


      {/* ===============================================
          ADD PROJECT MODAL
      =============================================== */}

      <AddProjectModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

    </div>
  );
}