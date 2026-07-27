"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import {
  Clock3,
  Target,
  TrendingUp,
} from "lucide-react";

const data = [
  {
    name: "Completed",
    value: 7,
    color: "#ef4444",
  },
  {
    name: "In Progress",
    value: 5,
    color: "#fb7185",
  },
  {
    name: "Not Started",
    value: 0,
    color: "#d1d5db",
  },
];

const StatCard = ({
  icon: Icon,
  title,
  value,
  color,
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6">

    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
    >
      <Icon size={22} />
    </div>

    <h2 className="mt-5 text-4xl font-bold text-gray-900">
      {value}
    </h2>

    <p className="mt-2 text-gray-500">
      {title}
    </p>

  </div>
);

export default function EmployeeTaskSummary() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-8 text-xl font-bold">
        Task Summary
      </h2>

      <div className="grid grid-cols-12 gap-6">

        {/* Donut */}

        <div className="col-span-12 lg:col-span-4">

          <div className="relative mx-auto h-64">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={data}
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

              </PieChart>

            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <h2 className="text-5xl font-bold">
                12
              </h2>

              <p className="text-gray-500">
                Total Tasks
              </p>

            </div>

          </div>

        </div>

        {/* Legend */}

        <div className="col-span-12 lg:col-span-2 flex flex-col justify-center gap-6">

          {data.map((item) => (

            <div
              key={item.name}
              className="flex items-center gap-3"
            >

              <div
                className="h-4 w-4 rounded-full"
                style={{
                  background: item.color,
                }}
              />

              <div>

                <p className="font-medium">
                  {item.name}
                </p>

                <p className="text-gray-500">

                  {item.value}

                </p>

              </div>

            </div>

          ))}

        </div>

        {/* Stats */}

        <div className="col-span-12 lg:col-span-6">

          <div className="grid grid-cols-3 gap-4">

            <StatCard
              icon={Clock3}
              title="Avg. Daily Hours"
              value="4.8h"
              color="bg-green-50 text-green-600"
            />

            <StatCard
              icon={Target}
              title="On-time Tasks"
              value="85%"
              color="bg-orange-50 text-orange-600"
            />

            <StatCard
              icon={TrendingUp}
              title="Avg. Performance"
              value="12%"
              color="bg-purple-50 text-purple-600"
            />

          </div>

        </div>

      </div>

    </div>
  );
}