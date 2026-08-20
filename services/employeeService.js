const API_URL = "http://localhost:5234/api/v1";

export async function getEmployeeList() {
  try {
    const response = await fetch(`${API_URL}/employee`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const apiData = await response.json();

    console.log("Employee API Response:", apiData);

    console.log(
  "Employee IDs:",
  apiData.map((employee) => employee.empId)
);

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
    const response = await fetch(`${API_URL}/employee/types`);

    if (!response.ok) {
      throw new Error(`Type API failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Employee Types:", data);

    return data;
  } catch (error) {
    console.error("Error fetching employee types:", error);
    throw error;
  }
}

export async function createEmployee(employeeData) {
  try {
    console.log("POST Employee Request:", employeeData);

    const response = await fetch(
      `${API_URL}/employee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      }
    );

    console.log("POST Response Status:", response.status);

    const responseText = await response.text();

    console.log("POST Response Body:", responseText);

    if (!response.ok) {
      throw new Error(
        `API Error ${response.status}: ${responseText}`
      );
    }

    // Some APIs return an empty response
    if (!responseText) {
      return null;
    }

    return JSON.parse(responseText);

  } catch (error) {
    console.error("Create Employee Error:", error);
    throw error;
  }
}

export async function getEmployeeNames() {
  try {
    const response = await fetch(`${API_URL}/employee/names`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Employee Names API failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Employee Names API Response:", data);

    return data;
  } catch (error) {
    console.error("Employee Names API Error:", error);
    throw error;
  }
}