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

export async function getFinanceProjects({ empId, pageNumber = 1, pageSize = 10, searchText = "" }) {
  const params = new URLSearchParams({ EmpId: empId, pageNumber, pageSize });
  if (searchText) params.set("searchText", searchText);
  const response = await axiosClient.get(`/finance-projects?${params}`);
  return response.data;
}

export async function getFinanceProjectById(projectId) {
  const response = await axiosClient.get(`/finance-project/${projectId}`);
  return response.data;
}

export async function updateFinanceProject({ projectId, payload }) {
  const response = await axiosClient.put(`/finance-project/${projectId}`, payload);
  return response.data;
}

export async function getBuyingCenters() {
  const response = await axiosClient.get("/finance-rate-card/buying-centers");
  return response.data;
}

export async function getProjectLookups() {
  const response = await axiosClient.get("/finance-project/lookups");
  return response.data;
}
