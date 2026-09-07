"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import TaskList from "../../tasks/TaskList";
import { fetchProjectTasks } from "@/store/slices/projectSlice";

export default function ProjectTaskPage() {
  const { projectId } = useParams();

  const dispatch = useDispatch();

  const {
    projectTasks,
    tasksLoading,
    tasksError,
  } = useSelector((state) => state.project);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectTasks(Number(projectId)));
    }
  }, [projectId, dispatch]);

  console.log("PROJECT ID:", projectId);
  console.log("PROJECT TASKS FROM REDUX:", projectTasks);

  if (tasksLoading) {
    return <div>Loading tasks...</div>;
  }

  if (tasksError) {
    return <div>{tasksError}</div>;
  }

  // Convert project-wise API response
  // into the format expected by the existing TaskList/TaskTable
  const formattedTasks = (projectTasks || []).map((task) => ({
    id: task.task_Id,
    title: task.task_Title,
    projectTitle: task.project_Title,
    projectCode: task.project_Code,

    employees: task.employee_Name
      ? [task.employee_Name]
      : [],

    startDate: task.start_Date,
    endDate: task.end_Date,

    // API currently doesn't provide priority
    priority: "",
  }));

  console.log("FORMATTED PROJECT TASKS:", formattedTasks);

  return (
    <TaskList
      tasks={formattedTasks}
      showBackButton={true}
    />
  );
}