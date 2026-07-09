"use client";

import { LayoutGrid, List } from "lucide-react";

export default function ViewToggle({ view, setView }) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-gray-300">

      <button
        onClick={() => setView("grid")}
        className={`flex items-center justify-center px-3 py-2 transition
          ${
            view === "grid"
              ? "bg-[#E12729] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
      >
        <LayoutGrid size={18} />
      </button>

      <button
        onClick={() => setView("list")}
        className={`flex items-center justify-center border-l border-gray-300 px-3 py-2 transition
          ${
            view === "list"
              ? "bg-[#E12729] text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
      >
        <List size={18} />
      </button>

    </div>
  );
}