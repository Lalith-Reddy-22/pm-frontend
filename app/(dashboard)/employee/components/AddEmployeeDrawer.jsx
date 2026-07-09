"use client";

export default function AddEmployeeDrawer({
  showDrawer,
  setShowDrawer,
}) {
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
              placeholder="Enter Employee Hours"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-xs outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />

          </div>

          {/* Team */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Team
            </label>

            <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-xs">

              <option>Tech Team</option>

            </select>

          </div>

          {/* Sub Team */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Sub Team
            </label>

            <select className="w-full rounded-lg border border-gray-300 bg-[#F2F2F2] px-4 py-2 text-xs">

              <option>Select Sub Team</option>

            </select>

          </div>

          {/* Type */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Type
            </label>

            <select className="w-full rounded-lg border border-gray-300 bg-[#F2F2F2] px-4 py-2 text-xs">

              <option>Select</option>

            </select>

          </div>

          {/* Utilization */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase">
              Utilization Required
            </label>

            <select className="w-full rounded-lg border border-gray-300 bg-[#F2F2F2] px-4 py-2 text-xs">

              <option>Select isRequired</option>

            </select>

          </div>

          {/* Buttons */}

          <div className="flex gap-4">

            <button
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