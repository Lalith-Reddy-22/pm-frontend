"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchLeaveTeams,
  fetchLeaveDesignations,
  fetchLeaves,
  addLeave,
  fetchLeaveById,
  editLeave,
} from "@/store/slices/leaveSlice";
import { ChevronUp, ChevronDown, Pencil, } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import ExportDropdown from "@/app/(dashboard)/employee/components/ExportDropdown";

export default function AddLeavePage() {
  const [activeTab, setActiveTab] = useState("add");
  const [showExport, setShowExport] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const initialForm = {
  team: "",
  designation: "",
  billableHours: "",
  nonBillableHours: "",
  startDate: "",
  endDate: "",
};

  const dispatch = useDispatch();

const {
  teams,
  designations,
  leaves,
  loadingTeams,
  loadingDesignations,
  loadingLeaves,
  submitting,
  loadingLeave,
  error,
  success,
} = useSelector((state) => state.leave);

const teamOptions = [
  {
    value: "",
    label: "Select Team",
  },
  ...teams.map((team) => ({
    value: String(team.id),
    label: team.teams_Name,
  })),
];

const designationOptions = [
  {
    value: "",
    label: "Select Designation",
  },
  ...designations.map((item) => ({
    value: item.empDesignation,
    label: item.empDesignation,
  })),
];
  
  const handleCopy = () => {
  console.log("Copy");
};

const handlePrint = () => {
  window.print();
};

const handlePDF = () => {
  console.log("Export PDF");
};

const handleCSV = () => {
  console.log("Export CSV");
};

  const [editingId, setEditingId] = useState(null);

  const [selectedTeamId, setSelectedTeamId] = useState("");

useEffect(() => {
  dispatch(fetchLeaveTeams());

  dispatch(
    fetchLeaves({
      pageNumber: 1,
      pageSize: 10000,
    })
  );
}, [dispatch]);


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
  const [formData, setFormData] = useState(initialForm);

  const [searchTerm, setSearchTerm] = useState("");

const mappedLeaveList = leaves.map((item) => ({
  id: item.id,
  teamId: item.team_Id,
  team: item.teams_Name,
  designation: item.designation,
  billableHours: item.design_Billablevalue,
  nonBillableHours: item.design_NonBillablevalue,
  startDate: item.start_date,
  endDate: item.end_date,
}));

const filteredLeaveList = mappedLeaveList.filter((row) => {
  const search = searchTerm.trim().toLowerCase();

  if (!search) return true;

  return Object.values(row).some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(search)
  );
});

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
  data: filteredLeaveList,
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

  const handleEdit = async (row) => {
  try {
    const data = await dispatch(
      fetchLeaveById(row.id)
    ).unwrap();

    console.log("EDIT LEAVE RESPONSE:", data);

    setFormData({
      team: String(data.team_Id ?? row.teamId ?? ""),
      designation:
        data.designation ?? row.designation ?? "",
      billableHours:
        data.design_Billablevalue ??
        row.billableHours ??
        "",
      nonBillableHours:
        data.design_NonBillablevalue ??
        row.nonBillableHours ??
        "",
      startDate:
        data.start_date ?? row.startDate ?? "",
      endDate:
        data.end_date ?? row.endDate ?? "",
    });

    const teamId = String(
      data.team_Id ?? row.teamId ?? ""
    );

    setSelectedTeamId(teamId);

    if (teamId) {
      await dispatch(
        fetchLeaveDesignations(Number(teamId))
      ).unwrap();
    }

    setEditingId(row.id);

    // Switch to Add/Edit tab
    setActiveTab("add");

  } catch (error) {
    console.error(
      "GET LEAVE BY ID ERROR:",
      error
    );
  }
};

const validateForm = () => {
  const errors = {};

  if (!formData.team) {
    errors.team = "Please select a team.";
  }

  if (!formData.designation) {
    errors.designation = "Please select a designation.";
  }

  if (!formData.billableHours && !formData.nonBillableHours) {
    errors.hours = "Please enter billable or non-billable hours.";
  }

  if (!formData.startDate) {
    errors.startDate = "Please select a start date.";
  }

  if (!formData.endDate) {
    errors.endDate = "Please select an end date.";
  }

  return errors;
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  setFormErrors({});

  const errors = validateForm();

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  const payload = {
    team_Id: Number(formData.team),
    designation: formData.designation,
    design_Billablevalue:
      Number(formData.billableHours) || 0,
    design_NonBillablevalue:
      Number(formData.nonBillableHours) || 0,
    start_date: formData.startDate,
    end_date: formData.endDate,
  };

  try {
    if (editingId) {
      // UPDATE
      await dispatch(
        editLeave({
          id: editingId,
          data: payload,
        })
      ).unwrap();

      console.log("Leave updated successfully");
    } else {
      // ADD
      await dispatch(
        addLeave(payload)
      ).unwrap();

      console.log("Leave added successfully");
    }

    // Refresh list
    await dispatch(
      fetchLeaves({
        pageNumber: 1,
        pageSize: 10000,
      })
    ).unwrap();

    // Reset form
    setFormData(initialForm);
    setSelectedTeamId("");
    setEditingId(null);

    // Go to list
    setActiveTab("list");

  } catch (error) {
    console.error(
      "SAVE LEAVE ERROR:",
      error
    );
  }
};

  const handleTeamChange = (teamId) => {
  setSelectedTeamId(teamId);

  setFormData((prev) => ({
    ...prev,
    team: teamId,
    designation: "",
  }));

  if (!teamId) {
    return;
  }

  dispatch(
    fetchLeaveDesignations(Number(teamId))
  );
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
  onChange={handleTeamChange}
  options={teamOptions}
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
    setFormData((prev) => ({
      ...prev,
      designation: value,
    }))
  }
  options={designationOptions}
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
                  className="h-8 w-full rounded-md border border-gray-300 px-4"
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
                  className="h-8 w-full rounded-md border border-gray-300 px-4"
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
                  className="h-8 w-full rounded-md border border-gray-300 px-4"
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
                  className="h-8 w-full rounded-md border border-gray-300 px-4"
                />
              </div>

              <div className="col-span-2 flex justify-center">

                <button
  type="submit"
  disabled={submitting}
  className="w-50 rounded-sm bg-[#E12729] py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting
    ? editingId
      ? "Updating..."
      : "Adding..."
    : editingId
      ? "Update Leave"
      : "Add Leave"}
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
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search..."
  className="h-8 rounded-md border border-gray-300 px-4 outline-none"
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

        <div className="relative">
  <ExportDropdown
    showExport={showExport}
    setShowExport={setShowExport}
    handleCopy={handleCopy}
    handlePrint={handlePrint}
    handlePDF={handlePDF}
    handleCSV={handleCSV}
    border="border-gray-200"
    t={{
      cardBg: "bg-white",
      textPrimary: "text-gray-700",
    }}
    isDark={false}
  />
</div>
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
  {loadingLeaves ? (
    <tr>
      <td
        colSpan={7}
        className="py-8 text-center text-sm text-gray-500"
      >
        Loading leaves...
      </td>
    </tr>
  ) : paginatedData.length === 0 ? (
    <tr>
      <td
        colSpan={7}
        className="py-8 text-center text-sm text-gray-500"
      >
        No leave records found.
      </td>
    </tr>
  ) : (
    paginatedData.map((row) => (
      <tr
        key={row.id}
        className="border-t transition hover:bg-gray-50"
      >
        {/* Edit */}
        <td className="px-4 py-4">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit Leave"
            onClick={() => handleEdit(row)}
            className="cursor-pointer opacity-60 transition-all duration-200"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </td>

        {/* Team */}
        <td className="px-4 py-4">
          {row.team}
        </td>

        {/* Designation */}
        <td className="px-4 py-4">
          {row.designation}
        </td>

        {/* Billable Hours */}
        <td className="px-4 py-4">
          {row.billableHours}
        </td>

        {/* Non Billable Hours */}
        <td className="px-4 py-4">
          {row.nonBillableHours}
        </td>

        {/* Start Date */}
        <td className="px-4 py-4">
          {row.startDate}
        </td>

        {/* End Date */}
        <td className="px-4 py-4">
          {row.endDate}
        </td>
      </tr>
    ))
  )}
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
      key={`ellipsis-${index}`}
      className="px-2 text-gray-400"
    >
      ...
    </span>
  ) : (
    <button
      key={`page-${index}`}
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