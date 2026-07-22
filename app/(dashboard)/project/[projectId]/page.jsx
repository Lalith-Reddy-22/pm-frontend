import TaskList from "../../tasks/TaskList";

const PROJECT_TASKS = [
  {
    id: 1,
    title: "Design Login Page",
    projectTitle: "Project Alpha",
    projectCode: "P001",
    priority: "High",
    employees: ["Keerthi"],
    startDate: "07/20/2026",
    endDate: "07/22/2026",
  },
  {
    id: 2,
    title: "Create Dashboard",
    projectTitle: "Project Alpha",
    projectCode: "P001",
    priority: "Medium",
    employees: ["Avinash"],
    startDate: "07/21/2026",
    endDate: "07/24/2026",
  },
];

export default function ProjectTaskPage({ params }) {
  const { projectId } = params;

  console.log(projectId);

  return <TaskList
  tasks={PROJECT_TASKS}
  showBackButton={true}
/>
}