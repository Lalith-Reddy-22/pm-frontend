"use client";

import { useState } from "react";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import DatePicker from "./DatePicker";

export default function AddProject() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    projectName: "",
    region: "",
    projectStatus: "",
    client: "",
    projectCode: "",
    type: "",
    subClient: "",
    startDate: "",
    endDate: "",
    projectOwner: "",

    includeBuyingCenter: false,
    buyingCenter: "",
    financialYear: "",
    purchaseOrderValue: "",
    predictedCost: "",
    outsourcingCost: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[#E12729] cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>

        </div>

      </div>

      {/* Main Layout */}

      <div className="grid grid-cols-12 gap-6">

        {/* Left Section */}

        <div className="col-span-12 xl:col-span-8">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Project Information
            </h2>

            <div className="grid grid-cols-2 gap-5">

              {/* Project Name */}

              <div className="col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Name
                </label>

                <input
                  value={formData.projectName}
                  onChange={(e) =>
                    handleChange("projectName", e.target.value)
                  }
                  placeholder="Enter Project Name"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              {/* Region */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Region
                </label>

                <input
                  value={formData.region}
                  onChange={(e) =>
                    handleChange("region", e.target.value)
                  }
                  placeholder="Enter Region"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Status
                </label>

                <select
                  value={formData.projectStatus}
                  onChange={(e) =>
                    handleChange("projectStatus", e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                >
                  <option value="">
                    Select Status
                  </option>

                  <option>Active</option>

                  <option>Completed</option>

                  <option>On Hold</option>

                </select>

              </div>

              {/* Client */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Client
                </label>

                <select
                  value={formData.client}
                  onChange={(e) =>
                    handleChange("client", e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                >
                  <option>Select Client</option>
                </select>

              </div>

              {/* Project Code */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Code
                </label>

                <input
                  value={formData.projectCode}
                  onChange={(e) =>
                    handleChange("projectCode", e.target.value)
                  }
                  placeholder="Enter Project Code"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              {/* Type */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type
                </label>

                <select
                  value={formData.type}
                  onChange={(e) =>
                    handleChange("type", e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                >
                  <option>Select Type</option>
                </select>

              </div>

              {/* Sub Client */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sub Client
                </label>

                <input
                  value={formData.subClient}
                  onChange={(e) =>
                    handleChange("subClient", e.target.value)
                  }
                  placeholder="Enter Sub Client"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              {/* Start Date */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date
                </label>

                <DatePicker />

              </div>

              {/* End Date */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </label>

                <DatePicker />

              </div>

              {/* Project Owner */}

              <div className="col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Owner
                </label>

                <input
                  value={formData.projectOwner}
                  onChange={(e) =>
                    handleChange("projectOwner", e.target.value)
                  }
                  placeholder="Enter Project Owner"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              <div className="flex items-center justify-start gap-3">

            <button
              type="button"
              onClick={() => {
                if (!formData.projectName.trim()) {
                  alert("Project Name is required");
                  return;
                }

                if (!formData.client) {
                  alert("Please select Client");
                  return;
                }

                if (!formData.projectStatus) {
                  alert("Please select Project Status");
                  return;
                }

                console.log("Create Project", formData);

                // TODO:
                // await axios.post("/api/projects", formData);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#E12729] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <Plus size={16} />
              Create Project
            </button>

          </div>

            </div>

          </div>

        </div>

                {/* Right Section */}

        <div className="col-span-12 xl:col-span-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm top-6">

  {/* Include Buying Center */}

  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">

    <input
      type="checkbox"
      checked={formData.includeBuyingCenter}
      onChange={(e) =>
        handleChange("includeBuyingCenter", e.target.checked)
      }
      className="h-5 w-5 accent-red-600"
    />

    <span className="text-sm font-medium text-gray-700">
      Include Buying Center
    </span>

  </div>

  {/* Budget Details Heading */}

  <h2 className="mt-5 mb-6 text-xl font-semibold text-gray-800">
    Budget Details
  </h2>

  {/* Show only when Include Buying Center is checked */}

  {formData.includeBuyingCenter && (

    <div className="space-y-5">

      {/* Buying Center */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Buying Center
        </label>

        <select
          value={formData.buyingCenter}
          onChange={(e) =>
            handleChange("buyingCenter", e.target.value)
          }
          className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-red-500"
        >
          <option value="">Select Buying Center</option>
        </select>

      </div>

      {/* Financial Year */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Financial Year
        </label>

        <select
          value={formData.financialYear}
          onChange={(e) =>
            handleChange("financialYear", e.target.value)
          }
          className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-red-500"
        >
          <option value="">Select Financial Year</option>
          <option>2025-2026</option>
          <option>2026-2027</option>
          <option>2027-2028</option>
        </select>

      </div>

      {/* Purchase Order */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Purchase Order Value
        </label>

        <input
          type="number"
          placeholder="0.00"
          value={formData.purchaseOrderValue}
          onChange={(e) =>
            handleChange("purchaseOrderValue", e.target.value)
          }
          className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-red-500"
        />

      </div>

      {/* Predicted Cost */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Predicted Cost
        </label>

        <input
          type="number"
          placeholder="0.00"
          value={formData.predictedCost}
          onChange={(e) =>
            handleChange("predictedCost", e.target.value)
          }
          className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-red-500"
        />

      </div>

      {/* Outsourcing Cost */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Outsourcing Cost
        </label>

        <input
          type="number"
          placeholder="0.00"
          value={formData.outsourcingCost}
          onChange={(e) =>
            handleChange("outsourcingCost", e.target.value)
          }
          className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-red-500"
        />

      </div>

    </div>

  )}

</div>

        </div>

      </div>

    </div>
  );
}