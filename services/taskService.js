import axiosClient from "./axiosClient";

export async function getTasks({
  empId,
  userType,
  startDate,
  endDate,
  searchText = "",
  projectId = 0,
  pageNumber = 1,
  pageSize = 10,
}) {
  const params = new URLSearchParams();

  params.append("empId", String(empId));
  params.append("userType", String(userType));
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  params.append("pageNumber", String(pageNumber));
  params.append("pageSize", String(pageSize));

  if (searchText) {
    params.append("searchText", searchText);
  }

  if (projectId > 0) {
    params.append("projectId", String(projectId));
  }

  const response = await axiosClient.get(
  `/Task?${params.toString()}`
);

console.log("=================================");
console.log("RAW TASK API - FIRST TASK");
console.log("=================================");

console.log(
  JSON.stringify(response.data?.tasks?.[0], null, 2)
);

console.log("=================================");
console.log("RAW TASK API - NEW TASKS");
console.log("=================================");

const newTasks = (response.data?.tasks || []).filter(
  task =>
    Number(task.taskId ?? task.Task_Id ?? task.id ?? task.Id) >= 69804
);

console.log(JSON.stringify(newTasks, null, 2));

return response.data;
}

export async function getTaskProjects({ empId, userType }) {
  const response = await axiosClient.get("/Task/projects", {
    params: { empId, userType },
  });
  return response.data;
}
