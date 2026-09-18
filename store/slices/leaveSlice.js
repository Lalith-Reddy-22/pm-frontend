import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getLeaveTeams,
  getLeaveDesignations,
  getLeaves,
  createLeave,
  getLeaveById,
  updateLeave,
} from "@/services/leaveService";

// ===============================
// Load teams
// ===============================

export const fetchLeaveTeams = createAsyncThunk(
  "leave/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      return await getLeaveTeams();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load teams."
      );
    }
  }
);

// ===============================
// Load designations
// ===============================

export const fetchLeaveDesignations = createAsyncThunk(
  "leave/fetchDesignations",
  async (teamId, { rejectWithValue }) => {
    try {
      return await getLeaveDesignations(teamId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load designations."
      );
    }
  }
);

// ===============================
// Load leave list
// ===============================

export const fetchLeaves = createAsyncThunk(
  "leave/fetchLeaves",
  async (
    {
      teamName = "",
      pageNumber = 1,
      pageSize = 10000,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      return await getLeaves({
        teamName,
        pageNumber,
        pageSize,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load leaves."
      );
    }
  }
);

// ===============================
// Create leave
// ===============================

export const addLeave = createAsyncThunk(
  "leave/addLeave",
  async (data, { rejectWithValue }) => {
    try {
      return await createLeave(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create leave."
      );
    }
  }
);

// ===============================
// Get leave by ID
// ===============================

export const fetchLeaveById = createAsyncThunk(
  "leave/fetchLeaveById",
  async (id, { rejectWithValue }) => {
    try {
      return await getLeaveById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load leave."
      );
    }
  }
);

// ===============================
// Update leave
// ===============================

export const editLeave = createAsyncThunk(
  "leave/editLeave",
  async (
    { id, data },
    { rejectWithValue }
  ) => {
    try {
      return await updateLeave(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update leave."
      );
    }
  }
);

// ===============================
// Initial State
// ===============================

const initialState = {
  teams: [],
  designations: [],
  leaves: [],

  loadingTeams: false,
  loadingDesignations: false,
  loadingLeaves: false,
  submitting: false,
  loadingLeave: false,

  error: null,
  success: false,
};

// ===============================
// Slice
// ===============================

const leaveSlice = createSlice({
  name: "leave",

  initialState,

  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    },

    clearLeaveSuccess: (state) => {
      state.success = false;
    },

    clearDesignations: (state) => {
      state.designations = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // Teams
      // =========================

      .addCase(
        fetchLeaveTeams.pending,
        (state) => {
          state.loadingTeams = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLeaveTeams.fulfilled,
        (state, action) => {
          state.loadingTeams = false;
          state.teams = action.payload || [];
        }
      )

      .addCase(
        fetchLeaveTeams.rejected,
        (state, action) => {
          state.loadingTeams = false;
          state.error = action.payload;
        }
      )

      // =========================
      // Designations
      // =========================

      .addCase(
        fetchLeaveDesignations.pending,
        (state) => {
          state.loadingDesignations = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLeaveDesignations.fulfilled,
        (state, action) => {
          state.loadingDesignations = false;
          state.designations =
            action.payload || [];
        }
      )

      .addCase(
        fetchLeaveDesignations.rejected,
        (state, action) => {
          state.loadingDesignations = false;
          state.error = action.payload;
        }
      )

      // =========================
      // Leave list
      // =========================

      .addCase(
        fetchLeaves.pending,
        (state) => {
          state.loadingLeaves = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLeaves.fulfilled,
        (state, action) => {
          state.loadingLeaves = false;

          state.leaves =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchLeaves.rejected,
        (state, action) => {
          state.loadingLeaves = false;
          state.error = action.payload;
        }
      )

      // =========================
      // Add
      // =========================

      .addCase(
        addLeave.pending,
        (state) => {
          state.submitting = true;
          state.success = false;
          state.error = null;
        }
      )

      .addCase(
        addLeave.fulfilled,
        (state) => {
          state.submitting = false;
          state.success = true;
        }
      )

      .addCase(
        addLeave.rejected,
        (state, action) => {
          state.submitting = false;
          state.error = action.payload;
        }
      )

      // =========================
      // Get by ID
      // =========================

      .addCase(
        fetchLeaveById.pending,
        (state) => {
          state.loadingLeave = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLeaveById.fulfilled,
        (state) => {
          state.loadingLeave = false;
        }
      )

      .addCase(
        fetchLeaveById.rejected,
        (state, action) => {
          state.loadingLeave = false;
          state.error = action.payload;
        }
      )

      // =========================
      // Update
      // =========================

      .addCase(
        editLeave.pending,
        (state) => {
          state.submitting = true;
          state.success = false;
          state.error = null;
        }
      )

      .addCase(
        editLeave.fulfilled,
        (state) => {
          state.submitting = false;
          state.success = true;
        }
      )

      .addCase(
        editLeave.rejected,
        (state, action) => {
          state.submitting = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearLeaveError,
  clearLeaveSuccess,
  clearDesignations,
} = leaveSlice.actions;

export default leaveSlice.reducer;