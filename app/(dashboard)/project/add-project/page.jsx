"use client";

import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import { fetchProjectById } from "@/store/slices/projectSlice";
import AddProject from "@/app/components/AddProject";

export default function AddProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading project form...
        </div>
      }
    >
      <AddProjectPageContent />
    </Suspense>
  );
}

function AddProjectPageContent() {
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