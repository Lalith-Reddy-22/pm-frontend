import axiosClient from "./axiosClient";

export async function getLeaveTeams() {
  const response = await axiosClient.get("/Leave/teams");
  return response.data;
}

export async function getLeaveDesignations(teamId) {
  const response = await axiosClient.get(
    `/Leave/designations?teamId=${teamId}`
  );

  return response.data;
}

export async function getLeaves({
  teamName = "",
  pageNumber = 1,
  pageSize = 10000,
}) {
  const params = new URLSearchParams();

  if (teamName) {
    params.append("teamName", teamName);
  }

  params.append("pageNumber", String(pageNumber));
  params.append("pageSize", String(pageSize));

  const response = await axiosClient.get(
    `/Leave?${params.toString()}`
  );

  return response.data;
}

export async function createLeave(data) {
  const response = await axiosClient.post(
    "/Leave",
    data
  );

  return response.data;
}

export async function getLeaveById(id) {
  const response = await axiosClient.get(
    `/Leave/${id}`
  );

  return response.data;
}

export async function updateLeave(id, data) {
  const response = await axiosClient.put(
    `/Leave/${id}`,
    data
  );

  return response.data;
}