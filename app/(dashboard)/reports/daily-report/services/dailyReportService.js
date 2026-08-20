const API_URL = "http://localhost:5000/api/v1";

export async function getDailyReports({
  todayDate,
  taskId = null,
  resourceName = "",
  pageNumber = 1,
  pageSize = 10,
}) {
  try {
    const params = new URLSearchParams();

    if (todayDate) {
      params.append("todayDate", todayDate);
    }

    if (taskId !== null && taskId !== undefined && taskId !== "") {
      params.append("taskId", taskId);
    }

    if (resourceName) {
      params.append("resourceName", resourceName);
    }

    params.append("pageNumber", pageNumber);
    params.append("pageSize", pageSize);

    const url = `${API_URL}/Reports/daily-reports?${params.toString()}`;

    console.log("Daily Reports API URL:", url);

    // Get JWT access token
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    // Call API with JWT
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Daily Reports API Status:",
        response.status
      );

      console.error(
        "Daily Reports API Status Text:",
        response.statusText
      );

      console.error(
        "Daily Reports API Error Body:",
        errorText
      );

      throw new Error(
        `Daily Reports API failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log("Daily Reports API Response:", data);

    return data;
  } catch (error) {
    console.error("Daily Reports Error:", error);
    throw error;
  }
}