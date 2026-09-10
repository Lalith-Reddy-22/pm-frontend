import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosClient";
import {
  getProjectsDropdown,
  getTaskList,
} from "@/services/reportService";

export const fetchProjectsDropdown = createAsyncThunk(
  "summaryReport/fetchProjectsDropdown",

  async (_, { rejectWithValue }) => {
    try {
      console.log("CALLING PROJECT DROPDOWN API");
      const data = await getProjectsDropdown();
      console.log("PROJECT API DATA:", data);
      return data;
    } catch (error) {
  return rejectWithValue(
    error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      error.message ||
      "Failed to fetch employee task details"
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

      const data = await getTaskList({
        empId,
        empType,
        startDate,
        endDate,
        projectId,
        searchText,
        pageNumber,
        pageSize,
      });
      return data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
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

      const startTime = performance.now();

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

      const endTime = performance.now();
      return response.data;
    } catch (error) {

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
      searchText = "",
      pageNumber = 1,
      pageSize = 5,
    },
    { rejectWithValue }
  ) => {
    try {

      const response = await axiosClient.get(
        "/Reports/emp-task-details",
        {
          params: {
            employeeId: Number(employeeId),
            searchText,
            pageNumber,
            pageSize,
          },
        }
      );


      return response.data;

    } catch (error) {
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
        {
          params: {
            projectId,
            startDate,
            endDate,
          },
        }
      );

      return tasks;

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

  // API may return either an array or paginated object
  const records = Array.isArray(payload)
    ? payload
    : payload?.data ??
      payload?.tasks ??
      payload?.items ??
      [];

  state.employeeTaskDetails = records.map((task, index) => ({
    id:
      task.id ??
      task.taskId ??
      task.task_ID ??
      task.task_Id ??
      task.task_id ??
      index,

    title:
      task.title ??
      task.taskTitle ??
      task.task_Title ??
      task.Task_Title ??
      "",

    start:
      task.start ??
      task.startDate ??
      task.start_Date ??
      task.StartDate ??
      task.start_Date_Formatted ??
      "",

    end:
      task.end ??
      task.endDate ??
      task.end_Date ??
      task.EndDate ??
      task.end_Date_Formatted ??
      "",

    actual:
      task.actual ??
      task.actualHours ??
      task.ActualHours ??
      task.logHours ??
      0,

    planned:
      task.planned ??
      task.plannedHours ??
      task.PlannedHours ??
      task.Planned_hours ??
      task.planneHours ??
      0,

    tasks:
      task.tasks ??
      task.taskCount ??
      task.task_Count ??
      "",
  }));

  // Total records from backend
  state.employeeTaskDetailsTotal =
    payload?.totalCount ??
    payload?.totalRecords ??
    payload?.totalItems ??
    records.length;

  // Total pages from backend
  state.employeeTaskDetailsTotalPages =
    payload?.totalPages ??
    Math.ceil(
      state.employeeTaskDetailsTotal /
        (payload?.pageSize ?? 5)
    );
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