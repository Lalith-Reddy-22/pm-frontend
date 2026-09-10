"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeekUtilization } from "@/store/slices/weekUtilizationSlice";

import Header from "./components/Header";
import FilterSection from "./components/FilterSection";
import SectionTitle from "./components/SectionTitle";
import SummaryTable from "./components/SummaryTable";
import DesignationTable from "./components/DesignationTable";
import ClientTable from "./components/ClientTable";
import { exportFile } from "@/store/slices/exportSlice";


export default function WeekUtilization() {

  const [startDate, setStartDate] = useState("2026-08-10");
  const [endDate, setEndDate] = useState("2026-08-14");

  const dispatch = useDispatch();

  const handleExportExcel = async () => {
  try {
    if (!startDate || !endDate) {
      alert("Please select Start Date and End Date.");
      return;
    }

    const exportData = [
      ...teamData.billable.map((item) => ({
        section: "Team Wise - Billable",
        name: item.team,
        employee: "",
        hours: item.hours,
        availableHours: item.available,
        utilization: item.utilization,
        revenue: item.revenue,
        cost: "",
      })),

      ...teamData.nonBillable.map((item) => ({
        section: "Team Wise - Non Billable",
        name: item.team,
        employee: "",
        hours: item.hours,
        availableHours: item.available,
        utilization: item.utilization,
        revenue: item.revenue,
        cost: "",
      })),

      ...designationData.billable.flatMap((department) =>
        department.rows.map((item) => ({
          section: `Designation Wise - Billable - ${department.department}`,
          name: item.designation,
          employee: item.employee,
          hours: item.planHours,
          availableHours: item.availableHours,
          utilization: item.utilization,
          revenue: "",
          cost: "",
        }))
      ),

      ...designationData.nonBillable.flatMap((department) =>
        department.rows.map((item) => ({
          section: `Designation Wise - Non Billable - ${department.department}`,
          name: item.designation,
          employee: item.employee,
          hours: item.planHours,
          availableHours: item.availableHours,
          utilization: item.utilization,
          revenue: "",
          cost: "",
        }))
      ),

      ...clientData.map((item) => ({
        section: "Client Wise",
        name: item.name,
        employee: "",
        hours: item.hours,
        availableHours: "",
        utilization: item.utilization,
        revenue: "",
        cost: item.cost,
      })),
    ];

    await dispatch(
  exportFile({
    fileName: `week-utilization-${startDate}-to-${endDate}`,
    format: "csv",
    columns: [
      { key: "section", header: "Section" },
      { key: "name", header: "Team / Designation / Client" },
      { key: "employee", header: "Employees" },
      { key: "hours", header: "Plan Hours" },
      { key: "availableHours", header: "Available Hours" },
      { key: "utilization", header: "Utilization" },
      { key: "revenue", header: "Revenue" },
      { key: "cost", header: "Cost" },
    ],
    data: exportData,
  })
).unwrap();

  } catch (error) {
    console.error("EXCEL EXPORT ERROR:", error);
  }
};

const {
  team,
  designation,
  client,
  loading,
  error,
} = useSelector(
  (state) => state.weekUtilization
);

const mapTeamData = (data = []) => {
  return data.map((item) => ({
    team: item.teams_Name || "",
    hours: item.plan_Hours ?? 0,
    available: item.availability_Hrs ?? 0,
    utilization: item.utilization_Plan || "",
    revenue: item.planned_Rev_Rec ?? 0,
  }));
};

const mapClientData = (data = []) => {
  return data.map((item) => ({
    name: item.clientwiseRR || "",
    hours: item.planned_Hrs ?? 0,
    cost: item.planned_Cost ?? 0,
    utilization: item.utilization || "",
  }));
};

const mapDesignationData = (data = []) => {
  const grouped = {};

  data.forEach((item) => {
    const department = item.department || "Unknown";

    if (!grouped[department]) {
      grouped[department] = {
        department,
        rows: [],
      };
    }

    grouped[department].rows.push({
      designation: item.empDesignation || "",
      employee: item.numEmployees ?? 0,
      planHours: item.plan_Hours ?? 0,
      availableHours: item.available_Hours ?? 0,
      utilization: item.utilization || "",
    });
  });

  return Object.values(grouped);
};

const teamData = {
  billable: mapTeamData(team?.billable),
  nonBillable: mapTeamData(team?.nonBillable),
};

const designationData = {
  billable: mapDesignationData(
    designation?.billable
  ),

  nonBillable: mapDesignationData(
    designation?.nonBillable
  ),
};

const clientData = mapClientData(client);

  

  const handleGenerateReport = () => {
  dispatch(
    fetchWeekUtilization({
      startDate,
      endDate,
    })
  );
};

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-4 sm:p-6">

      <div className="mx-auto max-w-[1600px] rounded-lg border bg-white shadow-md p-6">

        <Header />

        <FilterSection
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
  onGenerate={handleGenerateReport}
  onExportExcel={handleExportExcel}
/>

        {error && (
          <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="py-6 text-center text-sm text-gray-500">
            Loading utilization report...
          </div>
        )}

        <SectionTitle title="Utilization Summary Team Wise" />

        <div className="grid grid-cols-2 gap-4 mt-3">

          <SummaryTable
            title="BILLABLE"
            data={teamData.billable}
          />

          <SummaryTable
            title="NON BILLABLE"
            data={teamData.nonBillable}
          />

        </div>

        <SectionTitle title="Utilization Summary Designation Wise" />

        <div className="grid grid-cols-2 gap-4 mt-3">

          <DesignationTable
            title="BILLABLE"
            data={designationData.billable}
          />

          <DesignationTable
            title="NON BILLABLE"
            data={designationData.nonBillable}
          />

        </div>

        <SectionTitle title="Utilization Summary Client Wise" />

        <div className="mt-3">

          <ClientTable
            data={clientData}
          />

        </div>

      </div>

    </div>
  );
}