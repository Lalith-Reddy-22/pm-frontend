"use client";
import CustomSelect from "@/components/ui/CustomSelect";

import { Input } from "@/components/ui/input";

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
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
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

  <Input
  type="date"
  value={formData.startDate}
  onChange={(e) =>
    setFormData({
      ...formData,
      startDate: e.target.value,
    })
  }
/>
</div>

{/* End Date */}
<div>
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#E12729]-600">
    End Date <span className="text-red-500">*</span>
  </label>

  <Input
  type="date"
  value={formData.endDate}
  onChange={(e) =>
    setFormData({
      ...formData,
      endDate: e.target.value,
    })
  }
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
      { id: "open", name: "Open" },
      { id: "inprogress", name: "In Progress" },
      { id: "completed", name: "Completed" },
      { id: "hold", name: "On Hold" },
    ]}
  />
</div>



      </div>

      
    </div>
    
    
  );
}