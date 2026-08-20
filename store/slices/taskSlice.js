import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosClient";

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/Task", {
        params: {
          empId: params.empId,
          userType: params.userType,
          startDate: params.startDate,
          endDate: params.endDate,
          searchText: params.searchText,
          projectId: params.projectId,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
        },
      });

      console.log("TASK API RESPONSE:", response.data);

      return response.data;

    } catch (error) {
      console.error(
        "TASK API ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to load tasks."
      );
    }
  }
);

export const fetchTaskProjects = createAsyncThunk(
  "task/fetchTaskProjects",
  async ({ empId, userType }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/Task/projects", {
        params: {
          empId,
          userType,
        },
      });

      console.log(
        "TASK PROJECTS RESPONSE:",
        response.data
      );

      return response.data;
    } catch (error) {
      console.error(
        "TASK PROJECTS ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to load projects."
      );
    }
  }
);

const initialState = {
  tasks: [],

  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,

  projects: [],
  projectsLoading: false,
  projectsError: null,

  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",

  initialState,

  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.totalCount = 0;
      state.pageNumber = 1;
      state.pageSize = 10;
      state.totalPages = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
  builder
    
    .addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;

      state.tasks = (action.payload?.tasks || []).map((item) => ({
        id: item.task_Id,
        title: item.task_Title || "",
        projectTitle: item.project_Title || "",
        projectCode: item.projectCode || "",
        priority: item.tskpriority || "",

        employees: item.employee_Names
          ? item.employee_Names
              .split(",")
              .map((name) => name.trim())
          : [],

        startDate: item.start_Date_Formatted || "",
        endDate: item.end_Date_Formatted || "",
      }));

      state.totalCount = action.payload?.totalCount || 0;
      state.pageNumber = action.payload?.pageNumber || 1;
      state.pageSize = action.payload?.pageSize || 10;
      state.totalPages = action.payload?.totalPages || 0;
    })

    .addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload || "Failed to load tasks.";
      state.tasks = [];
    })

    
    .addCase(fetchTaskProjects.pending, (state) => {
      state.projectsLoading = true;
      state.projectsError = null;
    })

    .addCase(fetchTaskProjects.fulfilled, (state, action) => {
  state.projectsLoading = false;
  state.projectsError = null;

  state.projects = action.payload?.projects || [];
})

    .addCase(fetchTaskProjects.rejected, (state, action) => {
      state.projectsLoading = false;
      state.projectsError =
        action.payload || "Failed to load projects.";

      state.projects = [];
    });
},
});

export const { clearTasks } = taskSlice.actions;

export default taskSlice.reducer;