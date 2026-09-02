import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBuyingCenters, cloneBuyingCenter } from "@/services/financeClientService";

/* ── Thunks ──────────────────────────────────────────────────────────── */

export const fetchBuyingCenters = createAsyncThunk(
  "financeRateCardBuyingCenter/fetchBuyingCenters",
  async (_, { rejectWithValue }) => {
    try {
      return await getBuyingCenters();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load buying centers."
      );
    }
  }
);

export const cloneBuyingCenterThunk = createAsyncThunk(
  "financeRateCardBuyingCenter/cloneBuyingCenter",
  async ({ orgBId, buyCenterName, createdBy }, { dispatch, rejectWithValue }) => {
    try {
      const result = await cloneBuyingCenter({ orgBId, buyCenterName, createdBy });
      // Refresh the list so the cloned entry appears immediately
      dispatch(fetchBuyingCenters());
      return result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to clone buying center."
      );
    }
  }
);

/* ── Slice ───────────────────────────────────────────────────────────── */

const initialState = {
  // Array of { bId, bName, created_Date, isActive, created_By }
  buyingCenters: [],
  loading: false,
  error: null,
  cloning: false,
  cloneError: null,
};

const financeRateCardBuyingCenterSlice = createSlice({
  name: "financeRateCardBuyingCenter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Fetch list */
      .addCase(fetchBuyingCenters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyingCenters.fulfilled, (state, action) => {
        state.loading = false;
        state.buyingCenters = action.payload ?? [];
      })
      .addCase(fetchBuyingCenters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Clone */
      .addCase(cloneBuyingCenterThunk.pending, (state) => {
        state.cloning = true;
        state.cloneError = null;
      })
      .addCase(cloneBuyingCenterThunk.fulfilled, (state) => {
        state.cloning = false;
      })
      .addCase(cloneBuyingCenterThunk.rejected, (state, action) => {
        state.cloning = false;
        state.cloneError = action.payload;
      });
  },
});

export default financeRateCardBuyingCenterSlice.reducer;
