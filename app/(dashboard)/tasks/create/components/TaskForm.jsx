"use client";
import CustomSelect from "@/components/ui/CustomSelect";

import { Input } from "@/components/ui/input";
import DatePicker from "./DatePicker";

export default function TaskForm({
    formData,
    setFormData,
}) {
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
<div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
    Resource Name <span className="text-red-500">*</span>
  </label>

  <Input
  placeholder="Select Resource"
  value={formData.resource}
  onChange={(e) =>
    setFormData({
      ...formData,
      resource: e.target.value,
    })
  }
/>
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