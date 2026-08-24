import axiosClient from "./axiosClient";

export async function getFinancialYears() {
  const response = await axiosClient.get("/finance/financial-years");
  return response.data;
}

export async function getClientGP({ finYrId, pageNumber = 1, pageSize = 1000 }) {
  const params = new URLSearchParams();
  params.append("finYrId", finYrId);
  params.append("pageNumber", String(pageNumber));
  params.append("pageSize", String(pageSize));

  const response = await axiosClient.get(`/finance-client/client-gp?${params.toString()}`);
  return response.data;
}

export async function getClientProjects({ clientId, finYrId, pageNumber = 1, pageSize = 10, searchText = "", projectStatus = "" }) {
  const params = new URLSearchParams({ clientId, finYrId, pageNumber, pageSize });
  if (searchText)     params.set("searchText",    searchText);
  if (projectStatus)  params.set("projectStatus", projectStatus);
  const response = await axiosClient.get(`/finance-client/projects?${params}`);
  return response.data;
}

export async function getClientProjectSummary({ clientId, finYrId }) {
  const params = new URLSearchParams({ clientId, finYrId, pageNumber: 1, pageSize: 1000 });
  const response = await axiosClient.get(`/finance-client/projects?${params}`);
  return response.data;
}

export async function getProjectTasks({ projId, pageNumber = 1, pageSize = 10, searchText = "" }) {
  const params = new URLSearchParams({ projId, pageNumber, pageSize });
  if (searchText) params.set("searchText", searchText);
  const response = await axiosClient.get(`/finance-client/project-task-report?${params}`);
  return response.data;
}
