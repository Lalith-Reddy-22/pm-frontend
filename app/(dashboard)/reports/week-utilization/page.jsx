"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeekUtilization } from "@/store/slices/weekUtilizationSlice";

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function formatApiDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

import Header from "./components/Header";
import FilterSection from "./components/FilterSection";
import SectionTitle from "./components/SectionTitle";
import SummaryTable from "./components/SummaryTable";
import DesignationTable from "./components/DesignationTable";
import ClientTable from "./components/ClientTable";
import { exportFile } from "@/store/slices/exportSlice";


export default function WeekUtilization() {
  const [startDate, setStartDate] = useState(() =>
    formatApiDate(startOfWeek(new Date()))
  );
  const [endDate, setEndDate] = useState(() =>
    formatApiDate(addDays(startOfWeek(new Date()), 4))
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchWeekUtilization({
        startDate,
        endDate,
      })
    );
  }, [dispatch, startDate, endDate]);

  const handleExportExcel = async () => {
  try {
    if (!startDate || !endDate) {
      alert("Please select Start Date and End Date.");
      return;
    }

    const sections = [
      // =====================================================
      // 1. TEAM WISE - BILLABLE
      // =====================================================
      {
        title: "Utilization Summary Team Wise - BILLABLE",

        columns: [
          { key: "team", header: "Team" },
          { key: "planHours", header: "Plan Hours" },
          { key: "availableHours", header: "Available Hours" },
          { key: "utilization", header: "Utilization" },
          { key: "revenue", header: "Revenue" },
        ],

        data: teamData.billable.map((item) => ({
          team: item.team,
          planHours: item.hours,
          availableHours: item.available,
          utilization: item.utilization,
          revenue: item.revenue,
        })),
      },

      // =====================================================
      // 2. TEAM WISE - NON BILLABLE
      // =====================================================
      {
        title: "Utilization Summary Team Wise - NON BILLABLE",

        columns: [
          { key: "team", header: "Team" },
          { key: "planHours", header: "Plan Hours" },
          { key: "availableHours", header: "Available Hours" },
          { key: "utilization", header: "Utilization" },
          { key: "revenue", header: "Revenue" },
        ],

        data: teamData.nonBillable.map((item) => ({
          team: item.team,
          planHours: item.hours,
          availableHours: item.available,
          utilization: item.utilization,
          revenue: item.revenue,
        })),
      },

      // =====================================================
      // 3. DESIGNATION WISE - BILLABLE
      // =====================================================
      {
        title: "Utilization Summary Designation Wise - BILLABLE",

        columns: [
          { key: "department", header: "Department" },
          { key: "designation", header: "Designation" },
          { key: "employee", header: "No. of Employees" },
          { key: "planHours", header: "Plan Hours" },
          { key: "availableHours", header: "Available Hours" },
          { key: "utilization", header: "Utilization" },
        ],

        data: designationData.billable.flatMap((department) =>
          department.rows.map((item) => ({
            department: department.department,
            designation: item.designation,
            employee: item.employee,
            planHours: item.planHours,
            availableHours: item.availableHours,
            utilization: item.utilization,
          }))
        ),
      },

      // =====================================================
      // 4. DESIGNATION WISE - NON BILLABLE
      // =====================================================
      {
        title: "Utilization Summary Designation Wise - NON BILLABLE",

        columns: [
          { key: "department", header: "Department" },
          { key: "designation", header: "Designation" },
          { key: "employee", header: "No. of Employees" },
          { key: "planHours", header: "Plan Hours" },
          { key: "availableHours", header: "Available Hours" },
          { key: "utilization", header: "Utilization" },
        ],

        data: designationData.nonBillable.flatMap((department) =>
          department.rows.map((item) => ({
            department: department.department,
            designation: item.designation,
            employee: item.employee,
            planHours: item.planHours,
            availableHours: item.availableHours,
            utilization: item.utilization,
          }))
        ),
      },

      // =====================================================
      // 5. CLIENT WISE
      // =====================================================
      {
        title: "Utilization Summary Client Wise",

        columns: [
          { key: "client", header: "Client" },
          { key: "planHours", header: "Plan Hours" },
          { key: "utilization", header: "Utilization" },
          { key: "cost", header: "Cost" },
        ],

        data: clientData.map((item) => ({
          client: item.name,
          planHours: item.hours,
          utilization: item.utilization,
          cost: item.cost,
        })),
      },
    ];

    await dispatch(
      exportFile({
        fileName: `week-utilization-${startDate}-to-${endDate}`,
        format: "xlsx",

        // Keep these empty because this export
        // uses sections instead of one flat table.
        columns: [],
        data: [],

        sections,
      })
    ).unwrap();

  } catch (error) {
    console.error("WEEK UTILIZATION EXPORT ERROR:", error);
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
    const normalizedStart = startDate ? new Date(`${startDate}T12:00:00`) : null;
    const normalizedEnd = endDate ? new Date(`${endDate}T12:00:00`) : null;

    if (!startDate || !endDate || Number.isNaN(normalizedStart?.getTime()) || Number.isNaN(normalizedEnd?.getTime())) {
      alert("Please select a valid start date and end date.");
      return;
    }

    if (normalizedStart > normalizedEnd) {
      alert("Start date cannot be greater than end date.");
      return;
    }

    dispatch(
      fetchWeekUtilization({
        startDate,
        endDate,
      })
    );
  };

  const hasReportData =
    team.billable.length > 0 ||
    team.nonBillable.length > 0 ||
    designation.billable.length > 0 ||
    designation.nonBillable.length > 0 ||
    client.length > 0;

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

        {loading && !hasReportData && (
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