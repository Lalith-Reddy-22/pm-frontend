"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import ProjectToolbar from "./components/ProjectToolbar";
import ProjectTable from "./components/ProjectTable";
import ProjectPagination from "./components/Projectpagination";
import AddProjectModal from "./components/AddProjectModal";
import ProjectGrid from "./components/ProjectGrid";
import { fetchProjects } from "@/store/slices/projectSlice";
import { format } from "date-fns";
import { exportFile } from "@/store/slices/exportSlice";
import { api } from "@/lib/api";
import axiosClient from "@/services/axiosClient";
import { getProjectsDropdown } from "@/services/reportService";

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
const [exportLoading, setExportLoading] = useState(false);

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
    setExportLoading(true);

    console.log("===== PROJECT EXPORT START =====");
    console.log("Search:", search);
    console.log("Format:", exportFormat);

    // Get project data from existing Reports API
    const result = await getProjectsDropdown();

    console.log("===== PROJECT DROPDOWN RESPONSE =====");
    console.log(result);

    const allProjects = Array.isArray(result)
      ? result
      : result?.data || [];

      console.log("===== FIRST PROJECT OBJECT =====");
console.log(allProjects[0]);

console.log(
  "===== FIRST PROJECT KEYS ====="
);
console.log(
  allProjects[0]
    ? Object.keys(allProjects[0])
    : "No project"
);

    console.log(
      "TOTAL PROJECTS RECEIVED:",
      allProjects.length
    );

    if (allProjects.length === 0) {
      alert("No project data available for export.");
      return;
    }

   const exportData = allProjects
  .filter((project) => {
    if (!search.trim()) {
      return true;
    }

    const searchText = search.trim().toLowerCase();

    return Object.values(project).some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(searchText)
    );
  })
  .map((project) => ({
    projectCode:
      project.projectCode ??
      project.project_Code ??
      project.ProjectCode ??
      project.Project_Code ??
      project.project_ID ??
      project.projectId ??
      project.Project_ID ??
      "",

    projectTitle:
      project.project_Title ??
      project.projectTitle ??
      project.Project_Title ??
      project.ProjectTitle ??
      project.project_Name ??
      project.projectName ??
      project.Project_Name ??
      project.ProjectName ??
      "",

    client:
      project.client_Title ??
      project.clientTitle ??
      project.Client_Title ??
      project.ClientTitle ??
      project.client_Name ??
      project.clientName ??
      project.Client_Name ??
      project.ClientName ??
      "",
  }));

    console.log(
      "FINAL EXPORT COUNT:",
      exportData.length
    );

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

    console.log(
      "===== PROJECT EXPORT SUCCESS ====="
    );

  } catch (error) {
    console.error(
      "===== PROJECT EXPORT ERROR ====="
    );

    console.error("Message:", error?.message);
    console.error(
      "Response:",
      error?.response?.data
    );

    alert("Project export failed.");
  } finally {
    setExportLoading(false);
  }
};

const handleProjectSelectedPages = async (
  exportFormat,
  fromPage,
  toPage
) => {
  try {
    setExportLoading(true);

    const allProjects = [];

    for (
      let page = fromPage;
      page <= toPage;
      page++
    ) {
      const response = await axiosClient.get("/project/all", {
        params: {
          searchText: search,
          pageNumber: page,
          pageSize: pageSize,
        },
      });

      const pageProjects = response.data?.projects ?? [];

      allProjects.push(...pageProjects);
    }

    console.log(
      `PROJECTS FROM PAGE ${fromPage} TO ${toPage}:`,
      allProjects.length
    );

    const exportData = allProjects.map((project) => ({
      projectCode: project.projectCode ?? "",
      projectTitle: project.project_Title ?? "",
      client: project.client_Title ?? "",
    }));

    await dispatch(
      exportFile({
        fileName: `project-list-pages-${fromPage}-to-${toPage}-${format(
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
    console.error(
      "PROJECT SELECTED PAGE EXPORT ERROR:",
      error
    );
  } finally {
    setExportLoading(false);
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
  handleSelectedPages={handleProjectSelectedPages}
  totalPages={totalPages}
/>

      </div>


      {/* ===============================================
          TABLE / GRID
      =============================================== */}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">

  {loading && !exportLoading ? (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 size={22} className="animate-spin text-[#E12729]" />
        <p className="text-sm text-gray-500">Loading projects...</p>
      </div>
    </div>
  ) : error ? (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-red-500">
        {error}
      </p>
    </div>
  ) : (
    <>
      {view === "list" ? (
        <ProjectTable rows={projects} />
      ) : (
        <ProjectGrid projects={projects} />
      )}

      <ProjectPagination
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  )}

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