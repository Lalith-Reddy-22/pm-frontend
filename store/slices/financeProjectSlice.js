import { createSlice } from "@reduxjs/toolkit";

const financeProjectSlice = createSlice({
  name: "financeProject",
  initialState: {
    selectedProject: null,
  },
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
});

export const { setSelectedProject, clearSelectedProject } = financeProjectSlice.actions;
export default financeProjectSlice.reducer;
