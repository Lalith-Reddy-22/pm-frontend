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
          startDate,
          endDate,
          projectId,
          searchText,
          pageNumber,
          pageSize,
        },
      });

      console.log("TASK LIST API RESPONSE:", response);
      console.log("TASK LIST API DATA:", response.data);

      return response.data;
    } catch (error) {
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

  async (
    {
      startDate,
      endDate,
      searchText = "",
      pageNumber = 1,
      pageSize = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getEmployeeList({
        startDate,
        endDate,
        searchText,
        pageNumber,
        pageSize,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee report."
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
      const response = await getProjectList({
        empId,
        empType,
        searchText,
        pageNumber,
        pageSize,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load project report."
      );
    }
  }
);

// ======================================================
// 5. EMPLOYEE TASK DETAILS
// ======================================================

export const fetchEmployeeTaskDetails = createAsyncThunk(
  "summaryReport/fetchEmployeeTaskDetails",

  async (
    {
      employeeId,
      startDate,
      endDate,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getEmployeeTaskDetails({
        employeeId,
        startDate,
        endDate,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee task details."
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
      const response = await getProjectTaskDetails({
        projectId,
        startDate,
        endDate,
      });

      return response;
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
  projectData: [],
  projectTotalRecords: 0,
  projectPageNumber: 1,
  projectPageSize: 10,
  projectTotalPages: 0,
  projectLoading: false,
  projectError: null,

  // Employee task details
  employeeTaskDetails: [],
  employeeTaskDetailsLoading: false,
  employeeTaskDetailsError: null,

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

      state.projectData = [];
      state.projectTotalRecords = 0;
      state.projectPageNumber = 1;
      state.projectTotalPages = 0;

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

  state.taskData = action.payload?.data || [];

  state.taskTotalRecords =
    action.payload?.totalCount || 0;

  state.taskPageNumber =
    action.payload?.pageNumber || 1;

  state.taskPageSize =
    action.payload?.pageSize || 10;

  state.taskTotalPages =
    action.payload?.totalPages || 0;
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
          action.payload?.data || [];

        state.employeeTotalRecords =
          action.payload?.totalCount || 0;

        state.employeePageNumber =
          action.payload?.pageNumber || 1;

        state.employeePageSize =
          action.payload?.pageSize || 10;

        state.employeeTotalPages =
          action.payload?.totalPages || 0;
      })

      .addCase(fetchEmployeeList.rejected, (state, action) => {
        state.employeeLoading = false;

        state.employeeError =
          action.payload ||
          "Failed to load employee report.";
      })

      // ==================================================
      // PROJECT LIST
      // ==================================================

      .addCase(fetchProjectList.pending, (state) => {
        state.projectLoading = true;
        state.projectError = null;
      })

      .addCase(fetchProjectList.fulfilled, (state, action) => {
        state.projectLoading = false;

        state.projectData =
          action.payload?.data || [];

        state.projectTotalRecords =
          action.payload?.totalCount || 0;

        state.projectPageNumber =
          action.payload?.pageNumber || 1;

        state.projectPageSize =
          action.payload?.pageSize || 10;

        state.projectTotalPages =
          action.payload?.totalPages || 0;
      })

      .addCase(fetchProjectList.rejected, (state, action) => {
        state.projectLoading = false;

        state.projectError =
          action.payload ||
          "Failed to load project report.";
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

        state.employeeTaskDetails =
          action.payload || [];
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