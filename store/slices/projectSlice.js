import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosClient";
import { api } from "@/lib/api";

// =====================================================
// GET ALL PROJECTS
// GET /api/v1/project/all
// =====================================================

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (
    {
      searchText = "",
      pageNumber = 1,
      pageSize = 10,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.get("/project/all", {
        params: {
          searchText,
          pageNumber,
          pageSize,
        },
      });

      console.log("PROJECT LIST RESPONSE:", response.data);

      return response.data;
    } catch (error) {
  console.error("========== PROJECT LIST ERROR ==========");
  console.error("Message:", error.message);
  console.error("Status:", error.response?.status);
  console.error("Status Text:", error.response?.statusText);
  console.error("URL:", error.config?.url);
  console.error("Params:", error.config?.params);
  console.error("Response Data:", error.response?.data);
  console.error("Full Error:", error);
  console.error("========================================");

  return rejectWithValue(
    error.response?.data?.message ||
    error.response?.data?.title ||
    error.message ||
    "Failed to load projects."
  );
}
  }
);

export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/project/all", {
        params: {
          searchText: projectId,
          pageNumber: 1,
          pageSize: 1,
        },
      });

      console.log("PROJECT DETAILS RESPONSE:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "PROJECT DETAILS ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to load project details."
      );
    }
  }
);

export const fetchProjectTasks = createAsyncThunk(
  "project/fetchProjectTasks",
  async (projectId, { rejectWithValue }) => {
    try {
      const data = await api.get(
        `/project/${projectId}/tasks`
      );

      console.log("PROJECT TASKS API RESPONSE:", data);

      return data || [];
    } catch (error) {
      console.error("PROJECT TASKS ERROR:", error);

      return rejectWithValue(
        error.message || "Failed to load project tasks."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  projects: [],

   projectTasks: [],

  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,

  projectDetails: null,
projectDetailsLoading: false,
projectDetailsError: null,

  loading: false,
  tasksLoading: false,

  error: null,
  tasksError: null,
};

// =====================================================
// PROJECT SLICE
// =====================================================

const projectSlice = createSlice({
  name: "project",

  initialState,

  reducers: {
    clearProjects: (state) => {
      state.projects = [];

      state.totalCount = 0;
      state.pageNumber = 1;
      state.pageSize = 10;
      state.totalPages = 0;

      state.error = null;
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------------------------------------------------
      // FETCH PROJECTS - LOADING
      // -------------------------------------------------

      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // -------------------------------------------------
      // FETCH PROJECTS - SUCCESS
      // -------------------------------------------------

      .addCase(fetchProjects.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  const data = action.payload;

  state.totalCount = data?.totalCount || 0;
  state.totalPages = data?.totalPages || 0;
  state.pageNumber = data?.pageNumber || 1;
  state.pageSize = data?.pageSize || 10;

  state.projects = (data?.projects || []).map((item) => ({
    id: item.project_Id,

    name: item.project_Title || "",

    client: item.client_Title || "",

    startDate: item.startDate || "",

    endDate: item.endDate || "",

    status: item.project_Status_Text || "",

    totalPOValue: `$${Number(item.totalValue || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`,

    // API currently doesn't return outsource value
    outsourceValue: "$0.00",

    createDate: "—",

    // Keep additional API information if needed later
    projectCode: item.projectCode || "",
    financialYear: item.financial_Year || "",
    region: item.region || "",
    empCount: item.empCount || 0,
    completedTasks: item.completed_Tasks || 0,
    totalTasks: item.total_Tasks || 0,
    loggedHours: item.logged_Hours || 0,
    allocatedHours: item.allocated_Hours || 0,
  }));
})

.addCase(fetchProjectById.pending, (state) => {
  state.projectDetailsLoading = true;
  state.projectDetailsError = null;
})

.addCase(fetchProjectById.fulfilled, (state, action) => {
  state.projectDetailsLoading = false;
  state.projectDetailsError = null;

  const data = action.payload;

  state.projectDetails = data?.projects?.[0] || null;
})

.addCase(fetchProjectById.rejected, (state, action) => {
  state.projectDetailsLoading = false;
  state.projectDetailsError = action.payload;
  state.projectDetails = null;
})

.addCase(fetchProjectTasks.pending, (state) => {
  state.tasksLoading = true;
  state.tasksError = null;
})

.addCase(fetchProjectTasks.fulfilled, (state, action) => {
  state.tasksLoading = false;
  state.tasksError = null;

  console.log(
    "PROJECT TASKS IN REDUX:",
    action.payload
  );

  state.projectTasks = Array.isArray(action.payload)
    ? action.payload
    : [];
})

.addCase(fetchProjectTasks.rejected, (state, action) => {
  state.tasksLoading = false;

  state.tasksError =
    action.payload || "Failed to load project tasks.";

  state.projectTasks = [];
})

      // -------------------------------------------------
      // FETCH PROJECTS - ERROR
      // -------------------------------------------------

      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to load projects.";

        state.projects = [];

        state.totalCount = 0;
        state.totalPages = 0;
      });
  },
});

export const { clearProjects } = projectSlice.actions;

export default projectSlice.reducer;