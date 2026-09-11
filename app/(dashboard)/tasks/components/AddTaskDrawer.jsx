"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";
import { fetchTaskProjects } from "@/store/slices/taskSlice";

export default function AddTaskDrawer({ open, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedProject, setSelectedProject] = useState("");

  // Get projects from Redux
  const {
    projects,
    projectsLoading,
    projectsError,
  } = useSelector((state) => state.task);

  // Fetch projects when drawer opens
  useEffect(() => {
    if (!open) return;

    const empId = Number(
      sessionStorage.getItem("empId") || 0
    );

    const userType = Number(
      sessionStorage.getItem("userType") || 0
    );

    console.log("PROJECT DROPDOWN REQUEST:", {
      empId,
      userType,
    });

    dispatch(
      fetchTaskProjects({
        empId,
        userType,
      })
    );
  }, [open, dispatch]);

  const getProjectId = (project) =>
    project?.project_ID ??
    project?.projectId ??
    project?.Project_ID ??
    project?.project_Id ??
    project?.Project_Id ??
    project?.id ??
    "";

  const getProjectName = (project) =>
    project?.project_Title ??
    project?.projectTitle ??
    project?.projectName ??
    project?.Project_Title ??
    project?.ProjectTitle ??
    project?.ProjectName ??
    project?.project_Name ??
    project?.project_name ??
    project?.Project_Name ??
    project?.Project_name ??
    project?.project_Title_Name ??
    project?.title ??
    project?.name ??
    "";

  const getClientName = (project) =>
    project?.client_Title ??
    project?.clientTitle ??
    project?.clientName ??
    project?.Client_Title ??
    project?.ClientTitle ??
    project?.ClientName ??
    project?.client_Name ??
    project?.client_name ??
    project?.Client_Name ??
    project?.Client_name ??
    project?.client ??
    "";

  // Convert API response to CustomSelect format
  const projectOptions = projects.map((project) => {
    const projectId = getProjectId(project);
    const clientName = getClientName(project);
    const projectName = getProjectName(project);

    return {
      id: String(projectId),
      name:
        [clientName, projectName]
          .filter(Boolean)
          .join(" - ") ||
        projectName ||
        "Unnamed project",
    };
  });

  const handleAddTask = () => {
    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    const selectedProjectData = projects.find(
      (project) =>
        String(getProjectId(project)) === String(selectedProject)
    );

    const projectName = getProjectName(selectedProjectData) || "";
    const clientName = getClientName(selectedProjectData) || "";

    onClose();

    const params = new URLSearchParams({
      projectId: String(selectedProject),
    });

    if (projectName) {
      params.set("projectTitle", projectName);
      params.set("projectName", projectName);
    }

    if (clientName) {
      params.set("clientTitle", clientName);
      params.set("clientName", clientName);
    }

    router.push(`/tasks/create?${params.toString()}`);
  };

  // Now it is safe to return
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-[420px] bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">
            Add New Task
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5">

          <label className="mb-2 block font-medium">
            Select Project
          </label>

          <CustomSelect
            options={projectOptions}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder={
              projectsLoading
                ? "Loading projects..."
                : "Select Project"
            }
          />

          {/* API error */}
          {projectsError && (
            <p className="mt-2 text-sm text-red-500">
              {projectsError}
            </p>
          )}

          <button
            onClick={handleAddTask}
            disabled={projectsLoading}
            className="mt-2 rounded-lg bg-[#E12729] px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Add New Task
          </button>

          <span>&nbsp;&nbsp;</span>

          <button
            onClick={onClose}
            className="mt-2 rounded-lg border border-[#E12729] px-3 py-1"
          >
            Cancel
          </button>

        </div>
      </div>
    </>
  );
}