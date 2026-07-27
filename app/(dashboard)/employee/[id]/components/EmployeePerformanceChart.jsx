"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", completed: 18, assigned: 24 },
  { month: "Feb", completed: 24, assigned: 30 },
  { month: "Mar", completed: 20, assigned: 28 },
  { month: "Apr", completed: 34, assigned: 38 },
  { month: "May", completed: 42, assigned: 45 },
  { month: "Jun", completed: 38, assigned: 44 },
];

export default function EmployeePerformanceChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Performance Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Monthly task completion performance
          </p>
        </div>

        <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none">
          <option>This Year</option>
          <option>Last 6 Months</option>
          <option>Last 30 Days</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Completed</p>
          <h3 className="mt-1 text-2xl font-bold text-green-600">176</h3>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Assigned</p>
          <h3 className="mt-1 text-2xl font-bold text-blue-600">209</h3>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Efficiency</p>
          <h3 className="mt-1 text-2xl font-bold text-red-600">84%</h3>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="assigned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#ececec" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#16a34a"
              strokeWidth={3}
              fill="url(#completed)"
            />

            <Area
              type="monotone"
              dataKey="assigned"
              stroke="#dc2626"
              strokeWidth={3}
              fill="url(#assigned)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}