import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export const fetchFinancialYears = createAsyncThunk(
  "financialYear/fetchFinancialYears",
  async (_, { rejectWithValue }) => {
    try {
      console.log("CALLING FINANCIAL YEAR API");

      const data = await api.get("/api/v1/finance/financial-years");

      console.log("FINANCIAL YEAR API RESPONSE:", data);

      return data || [];
    } catch (error) {
      console.error("FINANCIAL YEAR LIST ERROR:", error);

      return rejectWithValue(
        error.message || "Failed to load financial years."
      );
    }
  }
);

const initialState = {
  financialYears: [],
  loading: false,
  error: null,
};

const financialYearSlice = createSlice({
  name: "financialYear",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFinancialYears.fulfilled, (state, action) => {
        state.loading = false;
        state.financialYears = action.payload || [];
      })

      .addCase(fetchFinancialYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.financialYears = [];
      });
  },
});

export default financialYearSlice.reducer;