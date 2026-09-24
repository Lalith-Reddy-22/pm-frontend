"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import { useEffect, useMemo, useState } from "react";
import { createEmployee, getEmployeeTypes } from "@/services/employeeService";

export default function AddEmployeeDrawer({
  showDrawer,
  setShowDrawer,
}) {
  
  const TEAM_OPTIONS = [
  {
    value: "",
    label: "Select Team",
  },
  {
    value: 1,
    label: "Tech Team",
  },
  {
    value: 2,
    label: "Creative Team",
  },
  {
    value: 3,
    label: "Content Team",
  },
  {
    value: 4,
    label: "PM Team",
  },
  {
    value: 5,
    label: "Finance Team",
  },
  {
    value: 6,
    label: "HR",
  },
  {
    value: 7,
    label: "Operations",
  },
  {
    value: 8,
    label: "Account Manager",
  },
];

const DESIGNATION_OPTIONS = [
  {
    id: 1,
    name: "Junior Medical Writer",
    teamId: 3,
  },
  {
    id: 2,
    name: "Medical Writer",
    teamId: 3,
  },
  {
    id: 3,
    name: "Reviewers",
    teamId: 3,
  },
  {
    id: 4,
    name: "Proof Reading/Copy Editor",
    teamId: 3,
  },
  {
    id: 5,
    name: "Creative Copywriter",
    teamId: 3,
  },
  {
    id: 6,
    name: "Junior Graphic Designer",
    teamId: 2,
  },
  {
    id: 7,
    name: "Graphic Designer",
    teamId: 2,
  },
  {
    id: 8,
    name: "Video/3D/E-module",
    teamId: 2,
  },
  {
    id: 9,
    name: "Reviwers",
    teamId: 2,
  },
  {
    id: 10,
    name: "QA/QC",
    teamId: 3,
  },
];

const UTILIZATION_OPTIONS = [
  {
    value: "",
    label: "Select Required",
  },
  {
    value: "1",
    label: "Yes",
  },
  {
    value: "0",
    label: "No",
  },
];

const [username, setUsername] = useState("");
const [emailId, setEmailId] = useState("");
const [designation, setDesignation] = useState("");
const [shortDesignation, setShortDesignation] = useState("");
const [empHours, setEmpHours] = useState("");

const [team, setTeam] = useState("");
const [subTeam, setSubTeam] = useState("");
const [type, setType] = useState("");
const [typeOptions, setTypeOptions] = useState([
  {
    value: "",
    label: "Select Type",
  },
]);
const [utilization, setUtilization] = useState("");
const subTeamOptions = useMemo(() => {
  if (!team) {
    return [
      {
        value: "",
        label: "Select Sub Team",
      },
    ];
  }

  return [
    {
      value: "",
      label: "Select Sub Team",
    },
    ...DESIGNATION_OPTIONS
      .filter((item) => item.teamId === Number(team))
      .map((item) => ({
        value: item.id,
        label: item.name,
      })),
  ];
}, [team]);

useEffect(() => {
  const loadEmployeeTypes = async () => {
    try {
      const data = await getEmployeeTypes();

      const options = [
        {
          value: "",
          label: "Select Type",
        },
        ...data.map((item) => ({
          value: item.id,
          label: item.user_Type,
        })),
      ];

      setTypeOptions(options);
    } catch (error) {
      console.error("Failed to load employee types:", error);
    }
  };

  loadEmployeeTypes();
}, []);

const handleAddEmployee = async () => {
  try {
    const employeeData = {
      empNo: username,
      teamId: Number(team),
      username: username,
      emailId: emailId,
      password: "Temp@123",
      designation: designation,
      userType: Number(type),
      empDesigType: Number(subTeam),
      empHours: Number(empHours),
      shortDesignation: shortDesignation,
      isUtilRequired: Number(utilization),
    };

    console.log("Sending Employee Data:", employeeData);

    const result = await createEmployee(employeeData);

    console.log("Employee Created Successfully:", result);

    alert("Employee added successfully!");

    setShowDrawer(false);
  } catch (error) {
    console.error("Failed to add employee:", error);

    alert(error.message);
  }
};


console.log("Selected Team ID:", team);

if (!showDrawer) return null;

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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
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
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
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
              value={shortDesignation}
              onChange={(e) => setShortDesignation(e.target.value)}
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
              value={empHours}
              onChange={(e) => setEmpHours(e.target.value)}
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
  onChange={(value) => {
    setTeam(value);
    setSubTeam("");
  }}
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
  options={subTeamOptions}
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
  options={typeOptions}
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
  dropdownMaxHeight={80}
/>

          </div>

          {/* Buttons */}

          <div className="flex gap-4 mb-4">

            <button
              onClick={handleAddEmployee}
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