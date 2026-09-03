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

export async function getFinanceRateCard({ teamId }) {
  const params = new URLSearchParams({ teamId: String(teamId) });
  const response = await axiosClient.get(`/finance-rate-card?${params}`);
  return response.data;
}

export async function cloneBuyingCenter({ orgBId, buyCenterName, createdBy }) {
  const response = await axiosClient.post(
    "/finance-rate-card/buying-centers/clone",
    { orgBId, buyCenterName, createdBy }
  );
  return response.data;
}

export async function getRateCardProjects() {
  const response = await axiosClient.get("/finance-project-list-rate-card/projects");
  return response.data; // [{ projectId, projectName }]
}

export async function getRateCardEmployees() {
  const response = await axiosClient.get("/finance-project-list-rate-card/employees");
  return response.data; // [{ empId, employee_Name }]
}

export async function saveRateCardBuyingCenter(payload) {
  const response = await axiosClient.post("/finance-project-list-rate-card", payload);
  return response.data;
}

export async function updateRateCardBuyingCenter(payload) {
  const response = await axiosClient.put("/finance-project-list-rate-card/edit", payload);
  return response.data;
}

export async function getRateCardBuyingCenter(projectId) {
  const response = await axiosClient.get(`/finance-project-list-rate-card/buying-center/${projectId}`);
  return response.data; // { buyingCenterName, employees: [{ emp_Id, employee_Name, emp_Value, bName, ... }] }
}
