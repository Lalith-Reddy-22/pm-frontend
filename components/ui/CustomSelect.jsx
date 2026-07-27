"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedItem = options.find(
    (item) => String(item.id ?? item.value) === String(value)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position
  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();

      const dropdownHeight = 260;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = rect.bottom + 8;

      // Open upwards if there isn't enough space below
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = rect.top - dropdownHeight - 8;
      }

      setPopupStyle({
        position: "fixed",
        top,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm transition hover:border-[#E12729] focus:outline-none focus:ring-2 focus:ring-[#E12729]/20"
      >
        <span className={selectedItem ? "text-gray-900" : "text-gray-400"}>
          {selectedItem
            ? selectedItem.name ?? selectedItem.label
            : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={popupStyle}
            className="max-h-72 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-xl custom-scrollbar"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No options found
              </div>
            ) : (
              options.map((item) => {
                const itemValue = String(item.id ?? item.value);
                const selected =
                  itemValue === String(value);

                return (
                  <button
                    key={itemValue}
                    type="button"
                    onClick={() => {
                      onChange(itemValue);
                      setOpen(false);
                    }}
                    className={`block w-full px-4 py-3 text-left text-sm transition
                      ${
                        selected
                          ? "bg-red-50 text-[#E12729] font-medium"
                          : "hover:bg-red-50 hover:text-[#E12729]"
                      }`}
                  >
                    {item.name ?? item.label}
                  </button>
                );
              })
            )}
          </div>,
          document.body
        )}
    </div>
  );
}