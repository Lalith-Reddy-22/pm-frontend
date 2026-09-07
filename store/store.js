import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dailyReportReducer from "./slices/dailyReportSlice";
import weekUtilizationReducer from "./slices/weekUtilizationSlice";
import leaveReducer from "./slices/leaveSlice";
import resourceAllocationReducer from "./slices/resourceAllocationSlice";
import taskReducer from "./slices/taskSlice";
import summaryReportReducer from "./slices/summaryReportSlice";
import financeClientReducer from "./slices/financeClientSlice";
import projectReducer from "./slices/projectSlice";
import clientReducer from "./slices/clientSlice";
import financialYearReducer from "./slices/financialYearSlice";
import buyingCenterReducer from "./slices/buyingCenterSlice";
import timesheetReducer from "./slices/timesheetSlice";
import employeeReducer from "./slices/employeeSlice";
import financeProjectReducer from "./slices/financeProjectSlice";
import financeRateCardReducer from "./slices/financeRateCardSlice";
import financeRateCardBuyingCenterReducer from "./slices/financeRateCardBuyingCenterSlice";

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
    project: projectReducer,
    client: clientReducer,
    financialYear: financialYearReducer,
    buyingCenter: buyingCenterReducer,
    timesheet: timesheetReducer,
    employee: employeeReducer,
    financeProject: financeProjectReducer,
    financeRateCard: financeRateCardReducer,
    financeRateCardBuyingCenter: financeRateCardBuyingCenterReducer,
  },
});