import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosClient from "@/services/axiosClient";

export const fetchProjectsDropdown = createAsyncThunk(
  "summaryReport/fetchProjectsDropdown",

  async (_, { rejectWithValue }) => {
    try {
  console.log("CALLING PROJECT DROPDOWN API");

  console.log("AXIOS CLIENT:", axiosClient);
console.log("AXIOS CLIENT TYPE:", typeof axiosClient);
console.log("AXIOS GET:", typeof axiosClient?.get);
  const response = await axiosClient.get("/Reports/projects-dropdown");

  console.log("PROJECT API RESPONSE:", response);
  console.log("PROJECT API DATA:", response.data);

  return response.data;
} catch (error) {
  if ([401, 404, 503].includes(error.response?.status)) {
    const empId =
      typeof window !== "undefined"
        ? Number(sessionStorage.getItem("empId") || 0)
        : 0;
    const userType =
      typeof window !== "undefined"
        ? Number(sessionStorage.getItem("userType") || 0)
        : 0;
    const fallbackResponse = await axiosClient.get("/projects", {
      params: { empId, userType },
    });

    return fallbackResponse.data?.projects ?? fallbackResponse.data ?? [];
  }

  console.error("PROJECT API ERROR:", error);

  return rejectWithValue(
    error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      "Failed to load projects."
  );
}
  }
);

export const fetchTaskList = createAsyncThunk(
  "summaryReport/fetchTaskList",

  async (
    {
      empId,
      empType,
      startDate,
      endDate,
      projectId = 0,
      searchText = "",
      pageNumber = 1,
      pageSize = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("CALLING TASK LIST API");

      const response = await axiosClient.get("/Reports/task-list", {
        params: {
          empId,
          empType,
          userType: empType,
          startDate,
          endDate,
          projectId,
          search: searchText,
          searchText,
          pageNumber,
          pageSize,
        },
      });

      console.log("TASK LIST API RESPONSE:", response);
      console.log("TASK LIST API DATA:", response.data);

      return response.data;
    } catch (error) {
      if ([401, 404, 503].includes(error.response?.status)) {
        const fallbackResponse = await axiosClient.get("/Task", {
          params: {
            empId,
            userType: empType,
            startDate,
            endDate,
            projectId,
            searchText,
            pageNumber,
            pageSize,
          },
        });

        return fallbackResponse.data;
      }

      console.error("TASK LIST API ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load task list."
      );
    }
  }
);

// ======================================================
// 3. EMPLOYEE LIST
// ======================================================

export const fetchEmployeeList = createAsyncThunk(
  "summaryReport/fetchEmployeeList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/api/v1/Reports/employee-list"
      );

      console.log("EMPLOYEE LIST API RESPONSE:", response);
      console.log("EMPLOYEE LIST API DATA:", response.data);

      return response.data;
    } catch (error) {
      console.error("EMPLOYEE LIST API ERROR:", error);

      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

// ======================================================
// 4. PROJECT LIST
// ======================================================

export const fetchProjectList = createAsyncThunk(
  "summaryReport/fetchProjectList",
  async (
    {
      empId,
      empType,
      searchText = "",
      pageNumber = 1,
      pageSize = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("========== PROJECT LIST API ==========");
      console.log("empId:", empId);
      console.log("empType:", empType);
      console.log("searchText:", searchText);
      console.log("pageNumber:", pageNumber);
      console.log("pageSize:", pageSize);

      const response = await axiosClient.get(
        "/Reports/project-list",
        {
          params: {
            empId,
            empType,
            searchText,
            pageNumber,
            pageSize,
          },
        }
      );

      console.log("PROJECT LIST API RESPONSE:", response);
      console.log("PROJECT LIST API DATA:", response.data);

      return response.data;
    } catch (error) {
      console.error("PROJECT LIST API ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);
      console.error("PARAMS:", error.config?.params);

      return rejectWithValue(
        error.response?.data ||
        error.message ||
        "Failed to fetch project list"
      );
    }
  }
);

export const fetchEmployeeTaskDetails = createAsyncThunk(
  "summaryReport/fetchEmployeeTaskDetails",

  async (
    {
      employeeId,
      startDate,
      endDate,
      pageNumber = 1,
      pageSize = 5,
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("CALLING EMPLOYEE TASK DETAILS API");

      const formatRequestDate = (value) => {
        if (!value) return "";

        const date = value instanceof Date ? value : new Date(value);

        if (isNaN(date.getTime())) return "";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}/${month}/${day}`;
      };

      const requestStartDate = formatRequestDate(startDate);
      const requestEndDate = formatRequestDate(endDate);

      console.log("EMPLOYEE ID:", employeeId);
      console.log("START DATE:", requestStartDate);
      console.log("END DATE:", requestEndDate);
      console.log("PAGE:", pageNumber);
      console.log("PAGE SIZE:", pageSize);

      const response = await axiosClient.get(
        "/Reports/emp-task-details",
        {
          params: {
            employeeId: Number(employeeId),
            startDate: requestStartDate,
            endDate: requestEndDate,
            pageNumber,
            pageSize,
          },
        }
      );

      console.log(
        "EMPLOYEE TASK DETAILS API RESPONSE:",
        response
      );

      console.log(
        "EMPLOYEE TASK DETAILS API DATA:",
        response.data
      );

      return response.data;
    } catch (error) {
      console.error(
        "EMPLOYEE TASK DETAILS API ERROR:",
        error
      );

      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch employee task details"
      );
    }
  }
);
// ======================================================
// 6. PROJECT TASK DETAILS
// ======================================================

export const fetchProjectTaskDetails = createAsyncThunk(
  "summaryReport/fetchProjectTaskDetails",

  async (
    {
      projectId,
      startDate,
      endDate,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.get(
        "/Reports/project-task-details",
        { params: { projectId, startDate, endDate } }
      );

      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load project task details."
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  // Project dropdown
  projects: [],
  projectsLoading: false,
  projectsError: null,

  // Task report
  taskData: [],
  taskTotalRecords: 0,
  taskPageNumber: 1,
  taskPageSize: 10,
  taskTotalPages: 0,
  taskLoading: false,
  taskError: null,

  // Employee report
  employeeData: [],
  employeeTotalRecords: 0,
  employeePageNumber: 1,
  employeePageSize: 10,
  employeeTotalPages: 0,
  employeeLoading: false,
  employeeError: null,

  // Project report
  projectList: [],
projectListLoading: false,
projectListTotal: 0,
projectListTotalPages: 0,
projectListError: null,

  // Employee task details
  employeeTaskDetails: [],
employeeTaskDetailsLoading: false,
employeeTaskDetailsError: null,
employeeTaskDetailsTotal: 0,
employeeTaskDetailsTotalPages: 0,

  // Project task details
  projectTaskDetails: [],
  projectTaskDetailsLoading: false,
  projectTaskDetailsError: null,

};

// ======================================================
// SLICE
// ======================================================

const summaryReportSlice = createSlice({
  name: "summaryReport",

  initialState,

  reducers: {
    clearSummaryReport: (state) => {
      state.projects = [];

      state.taskData = [];
      state.taskTotalRecords = 0;
      state.taskPageNumber = 1;
      state.taskTotalPages = 0;

      state.employeeData = [];
      state.employeeTotalRecords = 0;
      state.employeePageNumber = 1;
      state.employeeTotalPages = 0;

      state.projectList = [];
      state.projectListTotal = 0;
      state.projectListPageNumber = 1;
      state.projectListTotalPages = 0;

      state.employeeTaskDetails = [];
      state.projectTaskDetails = [];

      state.projectsError = null;
      state.taskError = null;
      state.employeeError = null;
      state.projectError = null;
      state.employeeTaskDetailsError = null;
      state.projectTaskDetailsError = null;
    },

    clearEmployeeTaskDetails: (state) => {
      state.employeeTaskDetails = [];
      state.employeeTaskDetailsError = null;
    },

    clearProjectTaskDetails: (state) => {
      state.projectTaskDetails = [];
      state.projectTaskDetailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // PROJECT DROPDOWN
      // ==================================================

      .addCase(fetchProjectsDropdown.pending, (state) => {
        state.projectsLoading = true;
        state.projectsError = null;
      })

      .addCase(fetchProjectsDropdown.fulfilled, (state, action) => {
        state.projectsLoading = false;
        state.projects = action.payload || [];
      })

      .addCase(fetchProjectsDropdown.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError =
          action.payload || "Failed to load projects.";
      })

      // ==================================================
      // TASK LIST
      // ==================================================

      .addCase(fetchTaskList.pending, (state) => {
  state.taskLoading = true;
  state.taskError = null;
})

.addCase(fetchTaskList.fulfilled, (state, action) => {
  state.taskLoading = false;

  state.taskData =
    (Array.isArray(action.payload) ? action.payload : null) ??
    action.payload?.data ??
    action.payload?.tasks ??
    action.payload?.records ??
    action.payload?.items ??
    action.payload?.result?.data ??
    [];

  state.taskTotalRecords =
    action.payload?.totalCount ??
    action.payload?.totalRecords ??
    state.taskData.length;

  state.taskPageNumber =
    action.payload?.pageNumber || 1;

  state.taskPageSize =
    action.payload?.pageSize || 10;

  state.taskTotalPages =
    action.payload?.totalPages ??
    Math.ceil(
      state.taskTotalRecords / state.taskPageSize
    );
})

.addCase(fetchTaskList.rejected, (state, action) => {
  state.taskLoading = false;

  state.taskError =
    action.payload || "Failed to load task report.";
})

      // ==================================================
      // EMPLOYEE LIST
      // ==================================================

      .addCase(fetchEmployeeList.pending, (state) => {
  state.employeeLoading = true;
  state.employeeError = null;
})

.addCase(fetchEmployeeList.fulfilled, (state, action) => {
  state.employeeLoading = false;

  state.employeeData =
    Array.isArray(action.payload)
      ? action.payload
      : action.payload?.data || [];
})

.addCase(fetchEmployeeList.rejected, (state, action) => {
  state.employeeLoading = false;
  state.employeeError =
    action.payload || "Failed to load employee list.";
})
      // ==================================================
      // PROJECT LIST
      // ==================================================

      .addCase(fetchProjectList.pending, (state) => {
    state.projectListLoading = true;
    state.projectListError = null;
  })
  .addCase(fetchProjectList.fulfilled, (state, action) => {
    state.projectListLoading = false;

    state.projectList = action.payload?.data || [];
    state.projectListTotal = action.payload?.totalCount || 0;
    state.projectListTotalPages = action.payload?.totalPages || 0;
  })
  .addCase(fetchProjectList.rejected, (state) => {
    state.projectListLoading = false;
    state.projectListError = "Failed to fetch projects";
    state.projectList = [];
  })

      // ==================================================
      // EMPLOYEE TASK DETAILS
      // ==================================================

      .addCase(fetchEmployeeTaskDetails.pending, (state) => {
        state.employeeTaskDetailsLoading = true;
        state.employeeTaskDetailsError = null;
      })

      .addCase(fetchEmployeeTaskDetails.fulfilled, (state, action) => {
        state.employeeTaskDetailsLoading = false;

        const payload = action.payload;
        const records = Array.isArray(payload)
          ? payload
          : payload?.data ?? payload?.tasks ?? payload?.items ?? [];

        state.employeeTaskDetails = records.map((task, index) => ({
          id: task.id ?? task.task_Id ?? task.task_ID ?? index,
          title: task.title ?? task.task_Title ?? task.taskTitle ?? "",
          start:
            task.start ??
            task.start_Date_Formatted ??
            task.startDate ??
            "",
          end:
            task.end ??
            task.end_Date_Formatted ??
            task.endDate ??
            "",
          actual: task.actual ?? task.actualHours ?? task.logHours ?? 0,
          planned: task.planned ?? task.plannedHours ?? task.planneHours ?? 0,
          tasks: task.tasks ?? task.task_Count ?? "",
        }));
      })

      .addCase(fetchEmployeeTaskDetails.rejected, (state, action) => {
        state.employeeTaskDetailsLoading = false;

        state.employeeTaskDetailsError =
          action.payload ||
          "Failed to load employee task details.";
      })

      // ==================================================
      // PROJECT TASK DETAILS
      // ==================================================

      .addCase(fetchProjectTaskDetails.pending, (state) => {
        state.projectTaskDetailsLoading = true;
        state.projectTaskDetailsError = null;
      })

      .addCase(fetchProjectTaskDetails.fulfilled, (state, action) => {
        state.projectTaskDetailsLoading = false;

        state.projectTaskDetails =
          action.payload || [];
      })

      .addCase(fetchProjectTaskDetails.rejected, (state, action) => {
        state.projectTaskDetailsLoading = false;

        state.projectTaskDetailsError =
          action.payload ||
          "Failed to load project task details.";
      });
  },
});

export const {
  clearSummaryReport,
  clearEmployeeTaskDetails,
  clearProjectTaskDetails,
} = summaryReportSlice.actions;

export default summaryReportSlice.reducer;