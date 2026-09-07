import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFinanceRateCard } from "@/services/financeClientService";

/* ── Thunks ──────────────────────────────────────────────────────────── */

export const fetchFinanceRateCard = createAsyncThunk(
  "financeRateCard/fetchFinanceRateCard",
  async ({ teamId }, { rejectWithValue }) => {
    try {
      const data = await getFinanceRateCard({ teamId });
      return { teamId, data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load rate card data."
      );
    }
  }
);

/* ── Slice ───────────────────────────────────────────────────────────── */

const initialState = {
  // Cache keyed by teamId so switching teams doesn't re-fetch
  // Shape: { [teamId]: { teamType, totalCount, rows: [...] } }
  cache: {},
  loading: false,
  error: null,
  // Which team tab is currently selected (matches the department buttons)
  selectedTeamId: 1,
};

const financeRateCardSlice = createSlice({
  name: "financeRateCard",
  initialState,
  reducers: {
    setSelectedTeamId: (state, action) => {
      state.selectedTeamId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinanceRateCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinanceRateCard.fulfilled, (state, action) => {
        state.loading = false;
        const { teamId, data } = action.payload;
        state.cache[teamId] = {
          teamType:   data.teamType   ?? "",
          totalCount: data.totalCount ?? 0,
          rows:       data.data       ?? [],
        };
      })
      .addCase(fetchFinanceRateCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTeamId } = financeRateCardSlice.actions;
export default financeRateCardSlice.reducer;
