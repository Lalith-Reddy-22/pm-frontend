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

  return response.data;
}