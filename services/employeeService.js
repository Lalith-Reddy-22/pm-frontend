import axiosClient from "./axiosClient";

export async function getEmployees() {
  const response = await axiosClient.get("/employee");
  const data = response.data;
  return Array.isArray(data) ? data : (data?.employees ?? data?.data ?? []);
}

export async function getEmployeeList() {
  try {
    const response = await axiosClient.get("/employee");
    const apiData = Array.isArray(response.data) ? response.data : [];

    console.log("Employee API Response:", apiData);
    console.log("Employee IDs:", apiData.map((employee) => employee.empId));

    return apiData.map((employee, index) => ({
      id: `${employee.empId}-${index}`,
      name: employee.employee_Name || "",
      email: employee.emailId || "",
      designation: employee.designation || "",
      team: employee.teams_Name || "",
      createdDate: employee.created_Date || "",
      type: employee.user_Type || "",
      status: employee.status || "",
      initialLetters: employee.initial_Letters || "",
    }));
  } catch (error) {
    console.error("Employee API Error:", error);
    throw error;
  }
}

export async function getEmployeeTypes() {
  try {
    const response = await axiosClient.get("/employee/types");
    console.log("Employee Types:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee types:", error);
    throw error;
  }
}

export async function createEmployee(employeeData) {
  try {
    console.log("POST Employee Request:", employeeData);
    const response = await axiosClient.post("/employee", employeeData);
    console.log("POST Response:", response.data);
    return response.data ?? null;
  } catch (error) {
    console.error("Create Employee Error:", error);
    throw error;
  }
}

export async function getEmployeeNames() {
  try {
    const response = await axiosClient.get("/employee/names");
    console.log("Employee Names API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Employee Names API Error:", error);
    throw error;
  }
}
