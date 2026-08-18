import { createSlice } from "@reduxjs/toolkit";

const financeSlice = createSlice({
  name: "finance",
  initialState: {
    financialYears:      [],
    selectedYear:        "",
    clientsCache:        {}, // key: finYrId
    projectsCache:       {}, // key: `${clientId}-${finYrId}-${page}-${search}-${status}`
    clientSummaryCache:  {}, // key: `${clientId}-${finYrId}`
    tasksCache:          {}, // key: `${projId}-${page}-${search}`
  },
  reducers: {
    setFinancialYears:     (state, { payload })              => { state.financialYears          = payload; },
    setSelectedYear:       (state, { payload })              => { state.selectedYear            = payload; },
    setClientsCache:       (state, { payload: { key, data } }) => { state.clientsCache[key]     = data; },
    setProjectsCache:      (state, { payload: { key, data } }) => { state.projectsCache[key]    = data; },
    setClientSummaryCache: (state, { payload: { key, data } }) => { state.clientSummaryCache[key] = data; },
    setTasksCache:         (state, { payload: { key, data } }) => { state.tasksCache[key]       = data; },
  },
});

export const {
  setFinancialYears, setSelectedYear,
  setClientsCache, setProjectsCache, setClientSummaryCache, setTasksCache,
} = financeSlice.actions;

export default financeSlice.reducer;
