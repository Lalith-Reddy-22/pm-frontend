"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center mb-8">

      <h1 className="text-3xl font-semibold text-gray-700">
        Plan Revenue Recognition Report
      </h1>

      <button
       onClick={() => router.push("/reports/week-utilization/add-leave")}
       className="bg-[#E12729] hover:bg-[#E12729] text-white px-5 py-2 rounded text-sm shadow cursor-pointer">
       Add Employee Leave Information
      </button>

    </div>
  );
}