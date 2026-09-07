"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Completed", value: 98, color: "#22c55e" },
  { name: "Pending", value: 24, color: "#f59e0b" },
  { name: "Overdue", value: 6, color: "#ef4444" },
];

const progress = [
  {
    title: "Productivity",
    value: "86%",
    width: "86%",
    color: "bg-green-500",
  },
  {
    title: "Completion Rate",
    value: "92%",
    width: "92%",
    color: "bg-blue-500",
  },
  {
    title: "Average Hours",
    value: "7.5h",
    width: "75%",
    color: "bg-red-500",
  },
];

export default function EmployeeTaskSummary() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-6">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Task Summary
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Weekly productivity overview
          </p>
        </div>

        <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
          <option>This Week</option>
          <option>This Month</option>
        </select>

      </div>

      <div className="grid grid-cols-12 gap-8 p-6">

        {/* Donut Chart */}
        <div className="col-span-12 lg:col-span-4">

          <div className="h-64">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {data.map((item) => (
                    <Cell
                      key={item.name}
                      fill={item.color}
                    />
                  ))}
                </Pie>

              </PieChart>

            </ResponsiveContainer>

          </div>

          <div className="mt-4 space-y-2">

            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">

                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      background: item.color,
                    }}
                  />

                  <span className="text-sm text-gray-600">
                    {item.name}
                  </span>

                </div>

                <span className="font-semibold">
                  {item.value}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* Right */}

        <div className="col-span-12 lg:col-span-8">

          <div className="grid gap-5">

            {progress.map((item) => (
              <div key={item.title}>

                <div className="mb-2 flex justify-between">

                  <span className="font-medium text-gray-700">
                    {item.title}
                  </span>

                  <span className="font-semibold">
                    {item.value}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{
                      width: item.width,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}