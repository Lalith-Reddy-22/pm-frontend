"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RateCardHeader({ employee }) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-6">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#E12729] hover:underline cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Employee
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Buying Center List
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Configure buying center hours for this employee.
          </p>
        </div>
      </div>
    </div>
  );
}