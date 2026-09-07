import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// =====================================================
// GET EMPLOYEE DETAILS
// =====================================================

export const fetchEmployeeDetails = createAsyncThunk(
  "employee/fetchEmployeeDetails",
  async (empId, { rejectWithValue }) => {
    try {
      console.log("FETCH EMPLOYEE DETAILS - EMP ID:", empId);

      const response = await api.get(
        `/api/v1/employee/details?empId=${empId}`
      );

      console.log("FETCH EMPLOYEE DETAILS - RESPONSE:", response);

      return response;
    } catch (error) {
      console.error("FETCH EMPLOYEE DETAILS - ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee details."
      );
    }
  }
);

// =====================================================
// GET EMPLOYEE PROJECT DETAILS
// =====================================================

export const fetchEmployeeProjectDetails = createAsyncThunk(
  "employee/fetchEmployeeProjectDetails",
  async (
    {
      empId,
      pageNumber = 1,
      pageSize = 10,
      searchText = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/api/v1/employee/project-details?empId=${empId}&pageNumber=${pageNumber}&pageSize=${pageSize}&searchText=${encodeURIComponent(
          searchText
        )}`
      );

      console.log(
        "FETCH EMPLOYEE PROJECTS RESPONSE:",
        response
      );

      // IMPORTANT:
      // api.get() already returns the JSON body
      return response;
    } catch (error) {
      console.error(
        "FETCH EMPLOYEE PROJECTS ERROR:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee project details."
      );
    }
  }
);

// =====================================================
// GET EMPLOYEE TYPES
// =====================================================

export const fetchEmployeeTypes = createAsyncThunk(
  "employee/fetchEmployeeTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/employee/types");

return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee types."
      );
    }
  }
);

// =====================================================
// GET EMPLOYEE SUB TEAMS
// =====================================================

export const fetchEmployeeSubTeams = createAsyncThunk(
  "employee/fetchEmployeeSubTeams",
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await api.get(
  `/api/v1/employee/sub-teams?teamId=${teamId}`
);

return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee teams."
      );
    }
  }
);

export const fetchEmployeeTasks = createAsyncThunk(
  "employee/fetchEmployeeTasks",
  async (
    {
      empId,
      userType,
      startDate,
      endDate,
      pageNumber = 1,
      pageSize = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/api/v1/Task?empId=${empId}&userType=${userType}&startDate=${startDate}&endDate=${endDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee tasks."
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ empId, employeeData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/v1/employee/${empId}`,
        employeeData
      );

      console.log("UPDATE EMPLOYEE RESPONSE:", response);

      return response;
    } catch (error) {
      console.error("UPDATE EMPLOYEE ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to update employee."
      );
    }
  }
);

export const fetchEmployeeRateCard = createAsyncThunk(
  "employee/fetchEmployeeRateCard",
  async (empId, { rejectWithValue }) => {
    try {
      console.log("===== FETCH EMPLOYEE RATE CARD =====");
      console.log("Employee ID:", empId);

      const response = await api.get(
        `/api/employees/${empId}/rate-card`
      );

      console.log("RATE CARD RESPONSE:", response);

      return response;
    } catch (error) {
      console.error("RATE CARD ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load employee rate card."
      );
    }
  }
);

export const updateEmployeeRateCard = createAsyncThunk(
  "employee/updateEmployeeRateCard",
  async ({ empId, buyingCenters }, { rejectWithValue }) => {
    try {
      console.log("===== UPDATE EMPLOYEE RATE CARD =====");
      console.log("Employee ID:", empId);
      console.log("Buying Centers:", buyingCenters);

      const response = await api.post(
        `/api/employees/${empId}/rate-card`,
        {
          buyingCenters,
        }
      );

      console.log("RATE CARD UPDATE RESPONSE:", response);

      return response;
    } catch (error) {
      console.error("RATE CARD UPDATE ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to update employee rate card."
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,

  // Project details
  projects: [],
  projectsLoading: false,
  projectsError: null,
  projectPagination: null,

  employeeTasks: [],
employeeTasksLoading: false,
employeeTasksError: null,
employeeTaskPagination: null,

rateCard: null,
rateCardLoading: false,
rateCardError: null,

rateCardUpdateLoading: false,
rateCardUpdateError: null,

  // Employee types
  employeeTypes: [],
  employeeTypesLoading: false,
  employeeTypesError: null,

  // Sub teams
  subTeams: [],
  subTeamsLoading: false,
  subTeamsError: null,
  
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,

  reducers: {
    clearEmployeeDetails: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================================
      // EMPLOYEE DETAILS
      // =====================================================

      .addCase(fetchEmployeeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchEmployeeDetails.fulfilled, (state, action) => {
  console.log("REDUX EMPLOYEE FULFILLED:", action.payload);

  state.loading = false;
  state.data = action.payload;

  console.log("REDUX EMPLOYEE DATA SET:", state.data);
})
      .addCase(fetchEmployeeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load employee details.";
      })

      // =====================================================
      // PROJECT DETAILS
      // =====================================================

      .addCase(fetchEmployeeProjectDetails.pending, (state) => {
        state.projectsLoading = true;
        state.projectsError = null;
      })

      .addCase(fetchEmployeeProjectDetails.fulfilled, (state, action) => {
  console.log(
    "===== REDUX PROJECT RESPONSE =====",
    action.payload
  );

  console.log(
    "PROJECTS FROM RESPONSE:",
    action.payload?.projects
  );

  state.projectsLoading = false;

  state.projects = action.payload?.projects || [];

  state.projectPagination = {
    totalCount: action.payload?.totalCount || 0,
    pageNumber: action.payload?.pageNumber || 1,
    pageSize: action.payload?.pageSize || 10,
    totalPages: action.payload?.totalPages || 0,
  };

  console.log(
    "PROJECTS STORED IN REDUX:",
    state.projects
  );
})

      .addCase(fetchEmployeeProjectDetails.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError =
          action.payload || "Failed to load employee projects.";
      })

      // =====================================================
      // EMPLOYEE TYPES
      // =====================================================

      .addCase(fetchEmployeeTypes.pending, (state) => {
        state.employeeTypesLoading = true;
        state.employeeTypesError = null;
      })

      .addCase(fetchEmployeeTypes.fulfilled, (state, action) => {
        state.employeeTypesLoading = false;
        state.employeeTypes = action.payload || [];
      })

      .addCase(fetchEmployeeTypes.rejected, (state, action) => {
        state.employeeTypesLoading = false;
        state.employeeTypesError =
          action.payload || "Failed to load employee types.";
      })

      .addCase(fetchEmployeeTasks.pending, (state) => {
  state.employeeTasksLoading = true;
  state.employeeTasksError = null;
})

.addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
  console.log("===== REDUX EMPLOYEE TASKS =====");
  console.log("TASK RESPONSE:", action.payload);

  state.employeeTasksLoading = false;

  state.employeeTasks = action.payload?.tasks || [];

  state.employeeTaskPagination = {
    totalCount: action.payload?.totalCount || 0,
    pageNumber: action.payload?.pageNumber || 1,
    pageSize: action.payload?.pageSize || 10,
    totalPages: action.payload?.totalPages || 0,
  };
})

.addCase(fetchEmployeeTasks.rejected, (state, action) => {
  state.employeeTasksLoading = false;
  state.employeeTasksError =
    action.payload || "Failed to load employee tasks.";
})


.addCase(fetchEmployeeRateCard.pending, (state) => {
  state.rateCardLoading = true;
  state.rateCardError = null;
})

.addCase(fetchEmployeeRateCard.fulfilled, (state, action) => {
  state.rateCardLoading = false;
  state.rateCard = action.payload;
})

.addCase(fetchEmployeeRateCard.rejected, (state, action) => {
  state.rateCardLoading = false;
  state.rateCardError =
    action.payload || "Failed to load employee rate card.";
})

.addCase(updateEmployeeRateCard.pending, (state) => {
  state.rateCardUpdateLoading = true;
  state.rateCardUpdateError = null;
})
.addCase(updateEmployeeRateCard.fulfilled, (state, action) => {
  state.rateCardUpdateLoading = false;
  state.rateCardUpdateError = null;

  console.log(
    "===== RATE CARD UPDATE SUCCESS =====",
    action.payload
  );
})
.addCase(updateEmployeeRateCard.rejected, (state, action) => {
  state.rateCardUpdateLoading = false;
  state.rateCardUpdateError =
    action.payload || "Failed to update rate card.";
})

      // =====================================================
      // SUB TEAMS
      // =====================================================

      .addCase(fetchEmployeeSubTeams.pending, (state) => {
        state.subTeamsLoading = true;
        state.subTeamsError = null;
      })

      .addCase(fetchEmployeeSubTeams.fulfilled, (state, action) => {
        state.subTeamsLoading = false;
        state.subTeams = action.payload || [];
      })

      .addCase(fetchEmployeeSubTeams.rejected, (state, action) => {
        state.subTeamsLoading = false;
        state.subTeamsError =
          action.payload || "Failed to load employee teams.";
      });
  },
});

export const { clearEmployeeDetails } = employeeSlice.actions;

export default employeeSlice.reducer;