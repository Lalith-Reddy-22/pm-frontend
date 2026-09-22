import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getResourceAllocation,
  getResourceAllocationTaskDetail,
} from "@/services/resourceAllocationService";

export const fetchResourceAllocation = createAsyncThunk(
  "resourceAllocation/fetchResourceAllocation",
  async ({ startDate, endDate, teamId }, { rejectWithValue }) => {
    try {
      const response = await getResourceAllocation({
        startDate,
        endDate,
        teamId,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to load resource allocation."
      );
    }
  }
);

export const fetchTaskDetails = createAsyncThunk(
  "resourceAllocation/fetchTaskDetails",
  async ({ empId, dateVal }, { rejectWithValue }) => {
    try {
      const response = await getResourceAllocationTaskDetail(
        empId,
        dateVal
      );

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to load task details."
      );
    }
  }
);

const initialState = {
  employees: [],

  taskDetails: null,

  loading: false,
  taskDetailsLoading: false,

  error: null,
  taskDetailsError: null,
};

const resourceAllocationSlice = createSlice({
  name: "resourceAllocation",

  initialState,

  reducers: {
    clearTaskDetails: (state) => {
      state.taskDetails = null;
      state.taskDetailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Resource allocation
      .addCase(fetchResourceAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchResourceAllocation.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload?.employees || [];
      })

      .addCase(fetchResourceAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load resource allocation.";
        state.employees = [];
      })

      // Task details
      .addCase(fetchTaskDetails.pending, (state) => {
        state.taskDetailsLoading = true;
        state.taskDetailsError = null;
      })

      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        state.taskDetailsLoading = false;
        state.taskDetails = action.payload;
      })

      .addCase(fetchTaskDetails.rejected, (state, action) => {
        state.taskDetailsLoading = false;
        state.taskDetailsError =
          action.payload || "Failed to load task details.";
        state.taskDetails = null;
      });
  },
});

export const { clearTaskDetails } = resourceAllocationSlice.actions;

export default resourceAllocationSlice.reducer;