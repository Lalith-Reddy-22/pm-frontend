import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dailyReportReducer from "./slices/dailyReportSlice";
import weekUtilizationReducer from "./slices/weekUtilizationSlice";
import leaveReducer from "./slices/leaveSlice";
import resourceAllocationReducer from "./slices/resourceAllocationSlice";
import taskReducer from "./slices/taskSlice";
import summaryReportReducer from "./slices/summaryReportSlice";
import financeClientReducer from "./slices/financeClientSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dailyReport: dailyReportReducer,
    weekUtilization: weekUtilizationReducer,
    leave: leaveReducer,
    resourceAllocation: resourceAllocationReducer,
    task: taskReducer,
    summaryReport: summaryReportReducer,
    financeClient: financeClientReducer,
  },
});