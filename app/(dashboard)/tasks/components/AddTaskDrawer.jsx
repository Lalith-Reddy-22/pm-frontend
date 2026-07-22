"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/components/ui/CustomSelect";

const projects = [
  { id: 502, name: "ELZONRIS_Dr erba video-Update" },
  { id: 503, name: "AMI LATAM 3D Face Ageing Module" },
];

export default function AddTaskDrawer({ open, onClose }) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState("");

  if (!open) return null;

  const handleAddTask = () => {
    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    onClose();

    router.push(`/tasks/create?projectId=${selectedProject}`);
  };

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
          <h2 className="text-xl font-semibold">Add New Task</h2>

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
  options={projects}
  value={selectedProject}
  onChange={setSelectedProject}
  placeholder="Select Project"
/>
   
          <button
            onClick={handleAddTask}
            className="rounded-lg bg-[#E12729] px-3 py-1 text-white hover:bg-red-700 mt-2"
          >
            Add New Task
          </button>
          <span>&nbsp;&nbsp;</span>
          
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E12729] px-3 py-1 mt-2  "
          >
            Cancel
          </button>
        </div>        
      </div>
    </>
  );
}