"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function AddLeavePage() {
  const [activeTab, setActiveTab] = useState("add");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    team: "",
    designation: "",
    billableHours: "",
    nonBillableHours: "",
    startDate: "",
    endDate: "",
  });

  const [leaveList, setLeaveList] = useState([
    {
      id: 1,
      team: "Creative Team",
      designation: "GD",
      billableHours: 9,
      nonBillableHours: 9,
      startDate: "2025-09-01",
      endDate: "2025-09-05",
    },
    {
      id: 2,
      team: "Creative Team",
      designation: "Lead-3D",
      billableHours: 0,
      nonBillableHours: 0,
      startDate: "2025-09-01",
      endDate: "2025-09-04",
    },
    {
      id: 3,
      team: "Content Team",
      designation: "MD2",
      billableHours: 0,
      nonBillableHours: 0,
      startDate: "2025-09-01",
      endDate: "2025-09-05",
    },
  ]);

  const HeaderCell = ({ children }) => (
    <th className="px-4 py-3 text-left">
      <div className="flex items-center justify-between">
        <span>{children}</span>

        <div className="flex flex-col leading-none">
          <ChevronUp size={12} className="text-gray-400" />
          <ChevronDown size={12} className="-mt-1 text-gray-400" />
        </div>
      </div>
    </th>
  );

  const handleEdit = (row) => {
    setEditingId(row.id);

    setFormData({
      team: row.team,
      designation: row.designation,
      billableHours: row.billableHours,
      nonBillableHours: row.nonBillableHours,
      startDate: row.startDate,
      endDate: row.endDate,
    });

    setActiveTab("add");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setLeaveList((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      );
    } else {
      setLeaveList((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setEditingId(null);

    setFormData({
      team: "",
      designation: "",
      billableHours: "",
      nonBillableHours: "",
      startDate: "",
      endDate: "",
    });

    setActiveTab("list");
  };

  return (
    <div className="space-y-6 p-5">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Tabs */}

        <div className="grid grid-cols-2 border-b border-gray-200">

          <button
            onClick={() => setActiveTab("add")}
            className={`py-4 text-base font-semibold ${
              activeTab === "add"
                ? "bg-[#2F2F2F] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Add Leaves
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`py-4 text-base font-semibold ${
              activeTab === "list"
                ? "bg-[#2F2F2F] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Leaves List
          </button>

        </div>

        {activeTab === "add" && (

          <div className="p-8">

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
            >

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase">
                  Team Name
                </label>

                <select
                  value={formData.team}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      team: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-md border px-4"
                >
                  <option value="">Select Team</option>
                  <option>Creative Team</option>
                  <option>Content Team</option>
                  <option>Development Team</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase">
                  Designation
                </label>

                <select
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      designation: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-md border px-4"
                >
                  <option value="">Select Designation</option>
                  <option>GD</option>
                  <option>Lead-3D</option>
                  <option>MD2</option>
                  <option>MW</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase">
                  Billable Leave Hours
                </label>

                <input
                  type="number"
                  value={formData.billableHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billableHours: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-md border px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase">
                  Non Billable Leave Hours
                </label>

                <input
                  type="number"
                  value={formData.nonBillableHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nonBillableHours: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-md border px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase">
                  Start Date
                </label>

                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startDate: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-md border px-4"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase">
                  End Date
                </label>

                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endDate: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-md border px-4"
                />
              </div>

              <div className="col-span-2 flex justify-center">

                <button
                  type="submit"
                  className="w-72 rounded-md bg-gradient-to-r from-[#E12729] to-[#930000] py-3 font-semibold text-white"
                >
                  {editingId ? "Update Leave" : "Add Leave"}
                </button>

              </div>

            </form>

          </div>

        )}

{/* ================= LEAVES LIST ================= */}

{activeTab === "list" && (
  <div className="p-6">
    {/* Top Bar */}
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm">Search:</span>

        <input
          placeholder="Project Name or Code"
          className="h-10 rounded-md border border-gray-300 px-4 outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Show</span>

          <select className="rounded border border-gray-300 px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

          <span>entries</span>
        </div>

        <button className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
          Export
        </button>
      </div>
    </div>

    {/* Table */}

    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm uppercase tracking-wide text-gray-700">
          <tr>
            <HeaderCell>Edit</HeaderCell>
            <HeaderCell>Team Name</HeaderCell>
            <HeaderCell>Designation</HeaderCell>
            <HeaderCell>Billable Leave Hours</HeaderCell>
            <HeaderCell>Non Billable Leave Hours</HeaderCell>
            <HeaderCell>Start Date</HeaderCell>
            <HeaderCell>End Date</HeaderCell>
          </tr>
        </thead>

        <tbody>
          {leaveList.map((row) => (
            <tr
              key={row.id}
              className="border-t transition hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <button
                  onClick={() => handleEdit(row)}
                  className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 cursor-pointer"
                >
                  ✏️
                </button>
              </td>

              <td className="px-4 py-4">
                {row.team}
              </td>

              <td className="px-4 py-4">
                {row.designation}
              </td>

              <td className="px-4 py-4">
                {row.billableHours}
              </td>

              <td className="px-4 py-4">
                {row.nonBillableHours}
              </td>

              <td className="px-4 py-4">
                {row.startDate}
              </td>

              <td className="px-4 py-4">
                {row.endDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      </div>
    </div>
  );
}