import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosClient";

// =====================================================
// GET ALL BUYING CENTERS
// GET /api/v1/finance-rate-card/buying-centers
// =====================================================

export const fetchBuyingCenters = createAsyncThunk(
  "buyingCenter/fetchBuyingCenters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/finance-rate-card/buying-centers"
      );
      return response.data;
    } catch (error) {
      console.error(
        "BUYING CENTERS ERROR:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load buying centers."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  buyingCenters: [],
  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const buyingCenterSlice = createSlice({
  name: "buyingCenter",

  initialState,

  reducers: {
    clearBuyingCenters: (state) => {
      state.buyingCenters = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOADING
      .addCase(fetchBuyingCenters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // SUCCESS
      .addCase(fetchBuyingCenters.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.buyingCenters = action.payload || [];
      })

      // ERROR
      .addCase(fetchBuyingCenters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load buying centers.";

        state.buyingCenters = [];
      });
  },
});

export const { clearBuyingCenters } = buyingCenterSlice.actions;

export default buyingCenterSlice.reducer;