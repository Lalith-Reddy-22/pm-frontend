import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFinancialYears,
  getClientGP,
  getClientProjects,
  getClientProjectSummary,
  getProjectTasks,
} from "@/services/financeClientService";
import { getCurrentFinYearId } from "@/lib/getCurrentFinYear";

/* ── Thunks ──────────────────────────────────────────────────────────── */

export const fetchFinancialYears = createAsyncThunk(
  "financeClient/fetchFinancialYears",
  async (_, { rejectWithValue }) => {
    try {
      return await getFinancialYears();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to load financial years.");
    }
  }
);

export const fetchClientGP = createAsyncThunk(
  "financeClient/fetchClientGP",
  async ({ finYrId, pageNumber = 1, pageSize = 1000 }, { rejectWithValue }) => {
    try {
      const response = await getClientGP({ finYrId, pageNumber, pageSize });
      return { finYrId, data: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to load client GP data.");
    }
  }
);

export const fetchClientProjects = createAsyncThunk(
  "financeClient/fetchClientProjects",
  async ({ clientId, finYrId, pageNumber, pageSize, searchText, projectStatus, cacheKey }, { rejectWithValue }) => {
    try {
      const data = await getClientProjects({ clientId, finYrId, pageNumber, pageSize, searchText, projectStatus });
      return { cacheKey, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to load client projects.");
    }
  }
);

export const fetchClientProjectSummary = createAsyncThunk(
  "financeClient/fetchClientProjectSummary",
  async ({ clientId, finYrId, summaryKey }, { rejectWithValue }) => {
    try {
      const res = await getClientProjectSummary({ clientId, finYrId });
      const all = res.projects ?? [];
      const totalPO        = all.reduce((s, p) => s + (p.pO_Value_Numeric ?? 0), 0);
      const avgPredictedPct = all.length ? all.reduce((s, p) => s + (p.predicted_percentage ?? 0), 0) / all.length : 0;
      const avgActualPct    = all.length ? all.reduce((s, p) => s + (p.actual_percentage    ?? 0), 0) / all.length : 0;
      return {
        summaryKey,
        data: { clientTitle: all[0]?.client_Title ?? "", totalPO, avgPredictedPct, avgActualPct },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to load project summary.");
    }
  }
);

export const fetchProjectTasks = createAsyncThunk(
  "financeClient/fetchProjectTasks",
  async ({ projId, pageNumber, pageSize, searchText, cacheKey }, { rejectWithValue }) => {
    try {
      const data = await getProjectTasks({ projId, pageNumber, pageSize, searchText });
      return { cacheKey, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to load project tasks.");
    }
  }
);

/* ── Slice ───────────────────────────────────────────────────────────── */

const initialState = {
  financialYears: [],
  selectedYear: null,

  // Finance clients list
  clientsCache: {},
  yearsLoading: false,
  yearsError: null,
  clientsLoading: false,
  clientsError: null,

  // Client projects ([clientId] page)
  projectsCache: {},        // key: `${clientId}-${finYrId}-${page}-${search}-${status}`
  clientSummaryCache: {},   // key: `${clientId}-${finYrId}`
  projectsLoading: false,
  projectsError: null,

  // Project tasks ([clientId]/[projectIndex] page)
  tasksCache: {},           // key: `${projId}-${page}-${search}`
  tasksLoading: false,
  tasksError: null,
};

const financeClientSlice = createSlice({
  name: "financeClient",
  initialState,
  reducers: {
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    clearClientsCache: (state) => {
      state.clientsCache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      /* Financial Years */
      .addCase(fetchFinancialYears.pending,   (state) => { state.yearsLoading = true; state.yearsError = null; })
      .addCase(fetchFinancialYears.fulfilled, (state, action) => {
        state.yearsLoading = false;
        state.financialYears = action.payload ?? [];
        if (!state.selectedYear && action.payload?.length > 0) {
          state.selectedYear = getCurrentFinYearId(action.payload);
        }
      })
      .addCase(fetchFinancialYears.rejected,  (state, action) => { state.yearsLoading = false; state.yearsError = action.payload; })

      /* Client GP list */
      .addCase(fetchClientGP.pending,   (state) => { state.clientsLoading = true; state.clientsError = null; })
      .addCase(fetchClientGP.fulfilled, (state, action) => {
        state.clientsLoading = false;
        state.clientsCache[action.payload.finYrId] = action.payload.data?.clients ?? [];
      })
      .addCase(fetchClientGP.rejected,  (state, action) => { state.clientsLoading = false; state.clientsError = action.payload; })

      /* Client Projects */
      .addCase(fetchClientProjects.pending,   (state) => { state.projectsLoading = true; state.projectsError = null; })
      .addCase(fetchClientProjects.fulfilled, (state, action) => {
        state.projectsLoading = false;
        const { cacheKey, data } = action.payload;
        state.projectsCache[cacheKey] = {
          projects:   data.projects   ?? [],
          totalCount: data.totalCount ?? 0,
          totalPages: data.totalPages ?? 0,
        };
      })
      .addCase(fetchClientProjects.rejected,  (state, action) => { state.projectsLoading = false; state.projectsError = action.payload; })

      /* Client Project Summary */
      .addCase(fetchClientProjectSummary.fulfilled, (state, action) => {
        const { summaryKey, data } = action.payload;
        state.clientSummaryCache[summaryKey] = data;
      })

      /* Project Tasks */
      .addCase(fetchProjectTasks.pending,   (state) => { state.tasksLoading = true; state.tasksError = null; })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const { cacheKey, data } = action.payload;
        state.tasksCache[cacheKey] = {
          tasks:      data.tasks      ?? [],
          totalCount: data.totalCount ?? 0,
          totalPages: data.totalPages ?? 0,
        };
      })
      .addCase(fetchProjectTasks.rejected,  (state, action) => { state.tasksLoading = false; state.tasksError = action.payload; });
  },
});

export const { setSelectedYear, clearClientsCache } = financeClientSlice.actions;
export default financeClientSlice.reducer;
