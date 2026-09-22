import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDailyReports } from "@/services/reportService";

export const fetchDailyReports = createAsyncThunk(
  "dailyReport/fetchDailyReports",

  async (
    {
      todayDate,
      resourceName = "",
      searchText = "",
      pageNumber = 1,
      pageSize = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getDailyReports({
        todayDate,
        resourceName,
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
          "Failed to load daily reports."
      );
    }
  }
);

const initialState = {
  data: [],
  totalRecords: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,

  loading: false,
  error: null,
};

const dailyReportSlice = createSlice({
  name: "dailyReport",

  initialState,

  reducers: {
    clearDailyReports: (state) => {
      state.data = [];
      state.totalRecords = 0;
      state.pageNumber = 1;
      state.totalPages = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDailyReports.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDailyReports.fulfilled,
        (state, action) => {
          state.loading = false;

          state.data =
            action.payload?.data || [];

          state.totalRecords =
            action.payload?.totalRecords || 0;

          state.pageNumber =
            action.payload?.pageNumber || 1;

          state.pageSize =
            action.payload?.pageSize || 10;

          state.totalPages =
            action.payload?.totalPages || 0;
        }
      )

      .addCase(
        fetchDailyReports.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load daily reports.";
        }
      );
  },
});

export const {
  clearDailyReports,
} = dailyReportSlice.actions;

export default dailyReportSlice.reducer;