import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// =====================================================
// GET ALL CLIENTS
// GET /api/v1/client/all
// =====================================================

export const fetchClients = createAsyncThunk(
  "client/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get("/api/v1/client/all");

      console.log("CLIENT API RESPONSE:", data);

      return data.clients || [];
    } catch (error) {
      console.error("CLIENT LIST ERROR:", error);

      return rejectWithValue(
        error.message || "Failed to load clients."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  clients: [],

  loading: false,
  error: null,
};

// =====================================================
// CLIENT SLICE
// =====================================================

const clientSlice = createSlice({
  name: "client",

  initialState,

  reducers: {
    clearClients: (state) => {
      state.clients = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------------------------------------------------
      // FETCH CLIENTS - LOADING
      // -------------------------------------------------

      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // -------------------------------------------------
      // FETCH CLIENTS - SUCCESS
      // -------------------------------------------------

      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const data = action.payload;

        console.log("CLIENT DATA IN REDUX:", data);

        // API returns array
        state.clients = Array.isArray(data)
          ? data
          : [];
      })

      // -------------------------------------------------
      // FETCH CLIENTS - ERROR
      // -------------------------------------------------

      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to load clients.";

        state.clients = [];
      });
  },
});

export const { clearClients } = clientSlice.actions;

export default clientSlice.reducer;