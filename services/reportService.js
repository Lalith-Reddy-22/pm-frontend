import axiosClient from "./axiosClient";

export async function getDailyReports({
  todayDate,
  resourceName = "",
  pageNumber = 1,
  pageSize = 10,
}) {
  const params = new URLSearchParams();

  if (todayDate) {
    params.append("todayDate", todayDate);
  }

  if (
    resourceName &&
    resourceName !== "All Employees"
  ) {
    params.append("resourceName", resourceName);
  }

  params.append("pageNumber", String(pageNumber));
  params.append("pageSize", String(pageSize));

  console.log(
    "DAILY REPORT API PARAMS:",
    params.toString()
  );

  const response = await axiosClient.get(
    `/Reports/daily-reports?${params.toString()}`
  );

  console.log(
    "DAILY REPORT API RESPONSE:",
    response.data
  );

  return response.data;
}

export async function getProjectsDropdown() {
  const response = await axiosClient.get("/Reports/projects-dropdown");
  return response.data;
}

export async function getTaskList({
  empId,
  empType,
  startDate,
  endDate,
  projectId = 0,
  searchText = "",
  pageNumber = 1,
  pageSize = 10,
}) {
  const response = await axiosClient.get("/Reports/task-list", {
    params: {
      empId,
      empType,
      startDate,
      endDate,
      projectId,
      searchText,
      pageNumber,
      pageSize,
    },
  });
  return response.data;
}
