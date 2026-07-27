"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import { useState } from "react";

export default function AddEmployeeDrawer({
  showDrawer,
  setShowDrawer,
}) {
  if (!showDrawer) return null;
  const TEAM_OPTIONS = [
  {
    value: "",
    label: "Select Team",
  },
  {
    value: "Tech Team",
    label: "Tech Team",
  },
  {
    value: "Creative Team",
    label: "Creative Team",
  },
  {
    value: "Content Team",
    label: "Content Team",
  },
  {
    value: "QA Team",
    label: "QA Team",
  },
];

const SUB_TEAM_OPTIONS = [
  {
    value: "",
    label: "Select Sub Team",
  },
  {
    value: "Frontend",
    label: "Frontend",
  },
  {
    value: "Backend",
    label: "Backend",
  },
  {
    value: "UI/UX",
    label: "UI/UX",
  },
];

const TYPE_OPTIONS = [
  {
    value: "",
    label: "Select Type",
  },
  {
    value: "Permanent",
    label: "Permanent",
  },
  {
    value: "Contract",
    label: "Contract",
  },
  {
    value: "Intern",
    label: "Intern",
  },
];

const UTILIZATION_OPTIONS = [
  {
    value: "",
    label: "Select Required",
  },
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];

const [team, setTeam] = useState("");
const [subTeam, setSubTeam] = useState("");
const [type, setType] = useState("");
const [utilization, setUtilization] = useState("");

  return (
    <div className="fixed inset-0 z-50">

      {/* Background */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowDrawer(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 flex h-screen w-[420px] flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">

          <h2 className="text-xl font-semibold">
            Add Employee
          </h2>

          <button
            onClick={() => setShowDrawer(false)}
            className="text-3xl text-gray-400 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* Form */}

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-2">

          {/* Name */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Employee Name
            </label>

            <input
              placeholder="Enter Employee Name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

          </div>

          {/* Email */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Email
            </label>

            <input
              placeholder="Enter Employee Email Address"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

          </div>

          {/* Designation */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Designation
            </label>

            <input
              placeholder="Enter Employee Designation"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

          </div>

          {/* Short Form */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Short Form (Designation)
            </label>

            <input
              placeholder="Enter Employee Short Form"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

          </div>

          {/* Hours */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Employee Hours
            </label>

            <input
              type="number"
              placeholder="Enter Employee Hours"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

          </div>

          {/* Team */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Team
            </label>

            <CustomSelect
  value={team}
  onChange={setTeam}
  options={TEAM_OPTIONS}
  placeholder="Select Team"
/>

          </div>

          {/* Sub Team */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Sub Team
            </label>

            <CustomSelect
  value={subTeam}
  onChange={setSubTeam}
  options={SUB_TEAM_OPTIONS}
  placeholder="Select Sub Team"
/>

          </div>

          {/* Type */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Type
            </label>

            <CustomSelect
  value={type}
  onChange={setType}
  options={TYPE_OPTIONS}
  placeholder="Select Type"
/>

          </div>

          {/* Utilization */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Utilization Required
            </label>

            <CustomSelect
  value={utilization}
  onChange={setUtilization}
  options={UTILIZATION_OPTIONS}
  placeholder="Select Required"
/>

          </div>

          {/* Buttons */}

          <div className="flex gap-4">

            <button
              className="flex-1 rounded-lg bg-[#E12729] py-2 font-semibold text-white hover:bg-red-700"
            >
              Add New User
            </button>

            <button
              onClick={() => setShowDrawer(false)}
              className="flex-1 rounded-lg bg-gray-200 py-2 font-semibold"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}