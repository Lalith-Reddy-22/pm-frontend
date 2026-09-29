"use client";

import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { fetchProjectById } from "@/store/slices/projectSlice";
import AddProject from "@/app/components/AddProject";

function AddProjectPageInner() {
  const dispatch = useDispatch();

  // Get query parameters from URL
  const searchParams = useSearchParams();

  // Example:
  // /project/add-project?id=6818
  // editProjectId = "6818"
  const editProjectId = searchParams.get("id");

  // If id exists → Edit mode
  // If id doesn't exist → Add mode
  const isEditMode = !!editProjectId;

  const {
    projectDetails,
    projectDetailsLoading,
    projectDetailsError,
  } = useSelector((state) => state.project);

  // Fetch project when editing
  useEffect(() => {
    if (editProjectId) {
      dispatch(fetchProjectById(editProjectId));
    }
  }, [dispatch, editProjectId]);

  console.log("EDIT PROJECT ID:", editProjectId);
  console.log("EDIT MODE:", isEditMode);
  console.log("PROJECT DETAILS:", projectDetails);

  return (
    <AddProject
      isEditMode={isEditMode}
      projectId={editProjectId}
      projectDetails={projectDetails}
      projectDetailsLoading={projectDetailsLoading}
      projectDetailsError={projectDetailsError}
    />
  );
}

export default function AddProjectPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center gap-2 p-6 text-gray-500"><Loader2 size={16} className="animate-spin text-[#E12729]" />Loading...</div>}>
      <AddProjectPageInner />
    </Suspense>
  );
}