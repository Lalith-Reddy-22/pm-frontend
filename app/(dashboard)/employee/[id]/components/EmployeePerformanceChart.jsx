"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Mon", completed: 8, assigned: 10 },
  { name: "Tue", completed: 12, assigned: 15 },
  { name: "Wed", completed: 18, assigned: 22 },
  { name: "Thu", completed: 16, assigned: 20 },
  { name: "Fri", completed: 25, assigned: 28 },
  { name: "Sat", completed: 20, assigned: 24 },
  { name: "Sun", completed: 15, assigned: 18 },
];

export default function EmployeePerformanceChart() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Performance Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Weekly task analytics
          </p>
        </div>

        <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
          <option>Last 7 Days</option>
          <option>Last Month</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6">

        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-xs text-gray-500">Assigned</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">137</h3>
        </div>

        <div className="rounded-2xl bg-green-50 p-4">
          <p className="text-xs text-gray-500">Completed</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">118</h3>
        </div>

        <div className="rounded-2xl bg-red-50 p-4">
          <p className="text-xs text-gray-500">Efficiency</p>
          <h3 className="mt-2 text-3xl font-bold text-red-600">86%</h3>
        </div>

      </div>

      {/* Chart */}
      <div className="h-[340px] px-6 pb-6">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="assigned"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.30} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient
                id="completed"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.30} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
              </linearGradient>

            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="assigned"
              stroke="#dc2626"
              strokeWidth={3}
              fill="url(#assigned)"
            />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#16a34a"
              strokeWidth={3}
              fill="url(#completed)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}