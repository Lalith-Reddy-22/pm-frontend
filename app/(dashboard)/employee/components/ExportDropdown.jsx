"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Upload,
  ChevronDown,
  Copy,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

export default function ExportDropdown({
  showExport,
  setShowExport,
  handleCopy,
  handlePrint,
  handlePDF,
  handleCSV,
  border,
  t,
  isDark,
}) {
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Position dropdown
  useEffect(() => {
    if (!showExport || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();

      setPopupStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.right - 160,
        width: 160,
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
  }, [showExport]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowExport(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowExport]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setShowExport((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-lg border ${border}
        px-3 py-2 text-sm font-medium transition-colors
        ${
          isDark
            ? "bg-white/5 text-gray-300 hover:bg-white/10"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Upload size={14} />
        Export
        <ChevronDown
          size={14}
          className={`transition-transform ${
            showExport ? "rotate-180" : ""
          }`}
        />
      </button>

      {mounted &&
        showExport &&
        createPortal(
          <div
            ref={dropdownRef}
            style={popupStyle}
            className={`rounded-lg border ${border} ${t.cardBg} shadow-xl`}
          >
            <MenuButton
              icon={<Copy size={16} />}
              text="Copy"
              onClick={() => {
                handleCopy();
                setShowExport(false);
              }}
              t={t}
            />

            <MenuButton
              icon={<Printer size={16} />}
              text="Print"
              onClick={() => {
                handlePrint();
                setShowExport(false);
              }}
              t={t}
            />

            <MenuButton
              icon={<FileText size={16} />}
              text="PDF"
              onClick={() => {
                handlePDF();
                setShowExport(false);
              }}
              t={t}
            />

            <MenuButton
              icon={<FileSpreadsheet size={16} />}
              text="CSV"
              onClick={() => {
                handleCSV();
                setShowExport(false);
              }}
              t={t}
            />
          </div>,
          document.body
        )}
    </>
  );
}

function MenuButton({ icon, text, onClick, t }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${t.textPrimary} hover:bg-red-50`}
    >
      {icon}
      {text}
    </button>
  );
}