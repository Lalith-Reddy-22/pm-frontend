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

  // Convert API response to CustomSelect format
  const projectOptions = projects.map((project) => ({
    id: project.project_ID,
    name: project.project_Title?.trim() || "",
  }));

  const handleAddTask = () => {
    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    onClose();

    router.push(
      `/tasks/create?projectId=${selectedProject}`
    );
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