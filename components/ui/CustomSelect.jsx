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
  searchable = false,
  searchPlaceholder = "Search...",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedItem = options.find(
    (item) => String(item.id ?? item.value) === String(value)
  );

  const filteredOptions = searchable
    ? options.filter((item) => {
        const label = String(item.name ?? item.label ?? "");
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : options;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position
  useEffect(() => {
  if (!open || !buttonRef.current) return;

  const updatePosition = () => {
    const rect = buttonRef.current.getBoundingClientRect();

    const gap = 8;
    const dropdownHeight = Math.min(
      240,
      Math.max(80, options.length * 40 + 8)
    );

    let top = rect.bottom + gap;

    // Keep dropdown below the field.
    // If it would go beyond the viewport, limit its height.
    const availableBelow = window.innerHeight - top - 8;

    const maxHeight = Math.min(
      dropdownHeight,
      Math.max(80, availableBelow)
    );

    setPopupStyle({
      position: "fixed",
      top,
      left: rect.left,
      width: rect.width,
      maxHeight,
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
}, [open, options.length]);

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
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) {
            setSearchTerm("");
          }
        }}
        className="flex h-8 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm transition hover:border-[#E12729] focus:outline-none focus:ring-2 focus:ring-[#E12729]/20"
      >
        <span className={selectedItem && selectedItem.id !== "" ? "text-gray-900" : "text-gray-400"}>
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
            className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl custom-scrollbar"
          >
            {searchable && (
              <div className="border-b border-gray-200 p-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-sm outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20"
                />
              </div>
            )}

            <div className="max-h-[240px] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((item) => {
                  const itemValue = String(item.id ?? item.value);
                  const selected = itemValue === String(value);

                  return (
                    <button
                      key={itemValue}
                      type="button"
                      onClick={() => {
                        onChange(itemValue);
                        setOpen(false);
                        setSearchTerm("");
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm transition
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
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}