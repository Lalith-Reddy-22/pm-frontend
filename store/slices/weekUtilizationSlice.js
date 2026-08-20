import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getWeekUtilizationTeam,
  getWeekUtilizationDesignation,
  getClientWiseRevenue,
} from "@/services/weekUtilizationService";

export const fetchWeekUtilization = createAsyncThunk(
  "weekUtilization/fetchWeekUtilization",

  async (
    {
      startDate,
      endDate,
    },
    { rejectWithValue }
  ) => {
    try {
      const [
        teamResponse,
        designationResponse,
        clientResponse,
      ] = await Promise.all([
        getWeekUtilizationTeam({
          startDate,
          endDate,
        }),

        getWeekUtilizationDesignation({
          startDate,
          endDate,
        }),

        getClientWiseRevenue({
          startDate,
          endDate,
        }),
      ]);

      return {
        team: teamResponse,
        designation: designationResponse,
        client: clientResponse,
      };
    } catch (error) {
      console.error(
        "WEEK UTILIZATION API ERROR:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load utilization report."
      );
    }
  }
);

const initialState = {
  team: {
    billable: [],
    nonBillable: [],
  },

  designation: {
    billable: [],
    nonBillable: [],
  },

  client: [],

  loading: false,
  error: null,
};

const weekUtilizationSlice = createSlice({
  name: "weekUtilization",

  initialState,

  reducers: {
    clearWeekUtilization: (state) => {
      state.team = {
        billable: [],
        nonBillable: [],
      };

      state.designation = {
        billable: [],
        nonBillable: [],
      };

      state.client = [];

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchWeekUtilization.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchWeekUtilization.fulfilled,
        (state, action) => {
          state.loading = false;

          state.team =
            action.payload?.team || {
              billable: [],
              nonBillable: [],
            };

          state.designation =
            action.payload?.designation || {
              billable: [],
              nonBillable: [],
            };

          state.client =
            action.payload?.client || [];

          state.error = null;
        }
      )

      .addCase(
        fetchWeekUtilization.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load utilization report.";
        }
      );
  },
});

export const {
  clearWeekUtilization,
} = weekUtilizationSlice.actions;

export default weekUtilizationSlice.reducer;