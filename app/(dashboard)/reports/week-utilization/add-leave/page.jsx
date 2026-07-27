"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Pencil, } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";

export default function AddLeavePage() {
  const [activeTab, setActiveTab] = useState("add");

  const [editingId, setEditingId] = useState(null);
  const TEAM_OPTIONS = [
  { value: "", label: "Select Team" },
  { value: "Creative Team", label: "Creative Team" },
  { value: "Content Team", label: "Content Team" },
  { value: "Development Team", label: "Development Team" },
];
const DESIGNATION_OPTIONS = [
  {
    value: "",
    label: "Select Designation",
  },
  {
    value: "GD",
    label: "GD",
  },
  {
    value: "Lead-3D",
    label: "Lead-3D",
  },
  {
    value: "MD2",
    label: "MD2",
  },
  {
    value: "MW",
    label: "MW",
  },
];
const PAGE_SIZE_OPTIONS = [
  {
    value: "10",
    label: "10",
  },
  {
    value: "25",
    label: "25",
  },
  {
    value: "50",
    label: "50",
  },
];
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

  const {
  paginatedData,
  page,
  pageSize,
  setPageSize,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  goToPage,
  pageNumbers,
} = usePagination({
  data: leaveList,
  pageSize: 10,
});

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
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">

        {/* Tabs */}

        <div className="grid grid-cols-2 border-b border-gray-200">

          <button
            onClick={() => setActiveTab("add")}
            className={`py-3 text-base font-semibold ${
              activeTab === "add"
                ? "bg-[#2F2F2F] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Add Leaves
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`py-3 text-base font-semibold ${
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

                <CustomSelect
  value={formData.team}
  onChange={(value) =>
    setFormData({
      ...formData,
      team: value,
    })
  }
  options={TEAM_OPTIONS}
  placeholder="Select Team"
/>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase">
                  Designation
                </label>

                <CustomSelect
  value={formData.designation}
  onChange={(value) =>
    setFormData({
      ...formData,
      designation: value,
    })
  }
  options={DESIGNATION_OPTIONS}
  placeholder="Select Designation"
/>
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
                  className="w-50 rounded-sm bg-[#E12729] py-2 font-semibold text-white"
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

          <CustomSelect
  value={String(pageSize)}
  onChange={(value) => setPageSize(Number(value))}
  options={PAGE_SIZE_OPTIONS}
  className="w-20"
/>

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
          {paginatedData.map((row) => (
            <tr
              key={row.id}
              className="border-t transition hover:bg-gray-50"
            >
              <td className="px-4 py-4">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Edit Leave"
                onClick={() => handleEdit(row)}
                className="opacity-60 transition-all duration-200  cursor-pointer">
              <Pencil className="h-4 w-4" />
              </Button>
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
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-white px-5 py-4 md:flex-row">
  {/* Left */}
  <p className="text-sm text-gray-600">
    Showing <span className="font-semibold">{startIndex}</span> -{" "}
    <span className="font-semibold">{endIndex}</span> of{" "}
    <span className="font-semibold">{totalItems}</span> entries
  </p>

  {/* Right */}
  <div className="flex items-center gap-2">
    {/* First */}
    <button
      onClick={() => goToPage(1)}
      disabled={!hasPrev}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      &laquo;
    </button>

    {/* Previous */}
    <button
      onClick={prevPage}
      disabled={!hasPrev}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      &lsaquo;
    </button>

    {/* Page Numbers */}
    {pageNumbers.map((item, index) =>
      item === "…" ? (
        <span
          key={index}
          className="px-2 text-gray-400"
        >
          ...
        </span>
      ) : (
        <button
          key={item}
          onClick={() => goToPage(item)}
          className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
            page === item
              ? "bg-[#E12729] text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {item}
        </button>
      )
    )}

    {/* Next */}
    <button
      onClick={nextPage}
      disabled={!hasNext}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      &rsaquo;
    </button>

    {/* Last */}
    <button
      onClick={() => goToPage(totalPages)}
      disabled={!hasNext}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      &raquo;
    </button>
  </div>
</div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}