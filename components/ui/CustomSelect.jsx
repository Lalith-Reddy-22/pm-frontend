"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select",
}) {
  const [open, setOpen] = useState(false);

  const selectedItem = options.find(
    (item) => String(item.id) === String(value)
  );

  return (
    <div className="relative w-full">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 text-sm"
      >
        <span className={selectedItem ? "text-gray-900" : "text-gray-400"}>
          {selectedItem ? selectedItem.name : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(String(item.id));
                setOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm hover:bg-red-50 hover:text-[#E12729]"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}