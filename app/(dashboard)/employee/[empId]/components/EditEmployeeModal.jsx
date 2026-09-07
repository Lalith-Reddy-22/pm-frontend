"use client";

import { useState, useEffect } from "react";

export default function EditEmployeeModal({
  open,
  employee,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    team: "",
    status: "",
    type: "",
    shortDesignation: "",
    hours: 9,
    utilization: "Yes",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        designation: employee.designation || "",
        team: employee.team || "",
        status: employee.status || "",
        type: employee.type || "",
        shortDesignation: employee.shortDesignation || "",
        hours: employee.hours || 9,
        utilization: employee.utilization || "Yes",
      });
    }
  }, [employee]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-[700px] rounded-xl bg-white shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-3xl text-gray-400 hover:text-black"
        >
          ×
        </button>

        <div className="p-6">

          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Edit Employee Information
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold uppercase">
              Employee Name
            </label>

            <input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold uppercase">
              Employee Email
            </label>

            <input
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* Designation & Team */}
          <div className="mb-4 grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase">
                Employee Designation
              </label>

              <input
                value={formData.designation}
                onChange={(e) =>
                  handleChange("designation", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase">
                Employee Team
              </label>

              <input
                value={formData.team}
                onChange={(e) =>
                  handleChange("team", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

          </div>

          {/* Short Designation / Hours / Utilization */}
          <div className="mb-4 grid grid-cols-3 gap-4">

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase">
                Short Designation
              </label>

              <input
                value={formData.shortDesignation}
                onChange={(e) =>
                  handleChange("shortDesignation", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase">
                Employee Hours
              </label>

              <input
                type="number"
                value={formData.hours}
                onChange={(e) =>
                  handleChange("hours", Number(e.target.value))
                }
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase">
                Utilization Required
              </label>

              <select
                value={formData.utilization}
                onChange={(e) =>
                  handleChange("utilization", e.target.value)
                }
                className="w-full rounded-lg border px-4 py-2"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

          </div>

          {/* Status & Type */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                Employee Active Status
              </label>

              <input
                value={formData.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                Employee Type
              </label>

              <input
                value={formData.type}
                onChange={(e) =>
                  handleChange("type", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-center gap-4">

            <button
              onClick={handleUpdate}
              className="rounded-lg bg-[#E12729] px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Update Details
            </button>

            <button
              onClick={onClose}
              className="rounded-lg bg-gray-200 px-8 py-3 font-semibold"
            >
              Cancel
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}