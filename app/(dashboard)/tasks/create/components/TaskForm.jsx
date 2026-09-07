"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomSelect from "@/components/ui/CustomSelect";
import { Input } from "@/components/ui/input";
import DatePicker from "./DatePicker";

import { fetchEmployeeNames } from "@/store/slices/taskSlice";

export default function TaskForm({
  formData,
  setFormData,
}) {
  const dispatch = useDispatch();

  const {
    employeeNames = [],
    employeeNamesLoading,
  } = useSelector((state) => state.task);

  const [resourceSearch, setResourceSearch] = useState("");
  const [showEmployeeList, setShowEmployeeList] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployeeNames());
  }, [dispatch]);

  const filteredEmployees = employeeNames.filter((employee) =>
    employee.employeeName
      ?.toLowerCase()
      .includes(resourceSearch.toLowerCase())
  );
  return (
<div className="mt-8 w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">  <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Add Task
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">

        {/* Task Name */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Task Name <span className="text-red-500">*</span>
          </label>

          <Input
  placeholder="Enter Task Name"
  value={formData.taskName}
  onChange={(e) =>
    setFormData({
      ...formData,
      taskName: e.target.value,
    })
  }
/>
        </div>

        {/* Task Priority */}
        <div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    Task Priority <span className="text-red-500">*</span>
  </label>

  <CustomSelect
    placeholder="Select Priority"
    value={formData.priority}
    onChange={(value) =>
      setFormData({
        ...formData,
        priority: value,
      })
    }
    options={[
      { label: "Select Priority", value: "" },
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
      { label: "Tentative", value: "Tentative" },
    ]}
  />
</div>

        {/* Client Name */}
<div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    Client Name
  </label>

  <Input
    placeholder="Select Client"
    value="Stemline"
  />
</div>

{/* Project Name */}
<div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    Project Name
  </label>

  <Input
    placeholder="Select Project"
    value="ME-5636 ELZONRIS_Dr erba video-Update"
  />
</div>

{/* Start Date */}
<div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    Start Date <span className="text-red-500">*</span>
  </label>

  <DatePicker
    value={formData.startDate}
    onChange={(val) => setFormData({ ...formData, startDate: val })}
    placeholder="Select Start Date"
  />
</div>

{/* End Date */}
<div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    End Date <span className="text-red-500">*</span>
  </label>

  <DatePicker
    value={formData.endDate}
    onChange={(val) => setFormData({ ...formData, endDate: val })}
    placeholder="Select End Date"
  />
</div>

{/* Resource Name */}
<div className="relative">
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    Resource Name <span className="text-red-500">*</span>
  </label>

  <Input
  placeholder="Select Resource"
  value={resourceSearch}
  onChange={(e) => {
    const value = e.target.value;

    setResourceSearch(value);

    if (value.trim() === "") {
      setShowEmployeeList(false);
    } else {
      setShowEmployeeList(true);
    }
  }}
  onFocus={() => {
    if (resourceSearch.trim() !== "") {
      setShowEmployeeList(true);
    }
  }}
/>

 {showEmployeeList && resourceSearch.trim() !== "" && (
  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
    {filteredEmployees.length === 0 ? (
      <div className="px-4 py-2 text-sm text-gray-500">
        No employees found
      </div>
    ) : (
      filteredEmployees.map((employee, index) => (
        <button
          key={`${employee.employeeId}-${index}`}
          type="button"
          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          onClick={() => {
            setFormData({
              ...formData,
              resource: employee.employeeName,
              resourceId: employee.employeeId,
            });

            setResourceSearch(employee.employeeName);
            setShowEmployeeList(false);
          }}
        >
          {employee.employeeName}
        </button>
      ))
    )}
  </div>
)}
</div>

{/* Task Status */}
<div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    Task Status <span className="text-red-500">*</span>
  </label>

  <CustomSelect
    placeholder="Select Status"
    value={formData.status}
    onChange={(value) =>
      setFormData({
        ...formData,
        status: value,
      })
    }
    options={[
      { label: "Select Status", value: "" },
      { id: "open", name: "Open" },
      { id: "closed", name: "Closed" },
      { id: "inprogress", name: "In Progress" },
    ]}
  />
</div>



      </div>

      
    </div>
    
    
  );
}