"use client";

import { useEffect, useState } from "react";

export default function EditEmployeeModal({
  showEditModal,
  setShowEditModal,
  employee,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    team: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        designation: employee.designation || "",
        team: employee.team || "",
        type: employee.type || "",
        status: employee.status || "",
      });
    }
  }, [employee]);

  if (!showEditModal) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    console.log("Updated Employee", formData);

    // Later you'll call your API here

    setShowEditModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[500px] rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-lg font-semibold">
            Edit Employee
          </h2>

          <button
            onClick={() => setShowEditModal(false)}
            className="text-2xl text-gray-400 hover:text-black"
          >
            ×
          </button>

        </div>

        <div className="space-y-4 p-6">

          <div>

            <label className="mb-1 block text-sm font-medium">
              Employee Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Designation
            </label>

            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Team
            </label>

            <input
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full rounded-lg border p-2"
            />

          </div>

          <div className="flex justify-end gap-3 pt-4">

            <button
              onClick={() => setShowEditModal(false)}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Update Employee
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}