"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import {
Upload,
ChevronDown,
ChevronRight,
Copy,
Printer,
FileText,
FileSpreadsheet,
Database,
Files,
Loader2,
} from "lucide-react";

export default function ExportDropdown({
showExport,
setShowExport,

// Export handlers
handleFullData,
handleSelectedPages,

// Total pages of the current report
totalPages = 1,

// Existing styling
border,
t,
isDark,
}) {
const buttonRef = useRef(null);
const dropdownRef = useRef(null);

const [mounted, setMounted] = useState(false);
const [popupStyle, setPopupStyle] = useState({});

// Which submenu is open?
const [activeMenu, setActiveMenu] = useState(null);

// Selected page range
const [fromPage, setFromPage] = useState("1");
const [toPage, setToPage] = useState(
  String(Math.max(1, Number(totalPages) || 1))
);

// Global export loading state
const { loading: exportLoading } = useSelector(
(state) => state.export
);

// =====================================================
// UPDATE PAGE RANGE WHEN TOTAL PAGES CHANGES
// =====================================================

useEffect(() => {
  const pages = Math.max(
    1,
    Number(totalPages) || 1
  );

  setFromPage("1");
  setToPage(String(pages));
}, [totalPages]);
// =====================================================
// MOUNT
// =====================================================

useEffect(() => {
setMounted(true);
}, []);

// =====================================================
// POSITION DROPDOWN
// =====================================================

useEffect(() => {
if (!showExport || !buttonRef.current) {
return;
}

const updatePosition = () => {
  const rect =
    buttonRef.current.getBoundingClientRect();

  setPopupStyle({
    position: "fixed",
    top: rect.bottom + 8,
    left: rect.right - 220,
    width: 220,
    zIndex: 9999,
  });
};

updatePosition();

window.addEventListener(
  "scroll",
  updatePosition,
  true
);

window.addEventListener(
  "resize",
  updatePosition
);

return () => {
  window.removeEventListener(
    "scroll",
    updatePosition,
    true
  );

  window.removeEventListener(
    "resize",
    updatePosition
  );
};

}, [showExport]);

// =====================================================
// CLOSE ON OUTSIDE CLICK
// =====================================================

useEffect(() => {
const handleClickOutside = (e) => {
if (
buttonRef.current &&
!buttonRef.current.contains(e.target) &&
dropdownRef.current &&
!dropdownRef.current.contains(e.target)
) {
setShowExport(false);
setActiveMenu(null);
}
};

document.addEventListener(
  "mousedown",
  handleClickOutside
);

return () => {
  document.removeEventListener(
    "mousedown",
    handleClickOutside
  );
};

}, [setShowExport]);

// =====================================================
// CLOSE MENU
// =====================================================

const closeMenu = () => {
setShowExport(false);
setActiveMenu(null);
};

// =====================================================
// SELECTED PAGE RANGE
// =====================================================

const handleFromPageChange = (value) => {
  setFromPage(value);
};

const handleToPageChange = (value) => {
  setToPage(value);
};

const handleSelectedExport = (format) => {
  if (exportLoading) {
    return;
  }

  const from = Number(fromPage);
  const to = Number(toPage);

  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to)
  ) {
    alert("Please enter valid page numbers.");
    return;
  }

  if (
    from < 1 ||
    to < 1 ||
    from > pageCount ||
    to > pageCount
  ) {
    alert(
      `Please enter page numbers between 1 and ${pageCount}.`
    );
    return;
  }

  if (from > to) {
    alert(
      "From page cannot be greater than To page."
    );
    return;
  }

  handleSelectedPages(
    format,
    from,
    to
  );

  closeMenu();
};

// =====================================================
// PAGE OPTIONS
// =====================================================

const pageCount = Math.max(
1,
Number(totalPages) || 1
);

// =====================================================
// RENDER
// =====================================================

return (
<>
{/* =================================================
EXPORT BUTTON
================================================= */}

  <button
    ref={buttonRef}
    type="button"
    disabled={exportLoading}
    onClick={() => {
      if (exportLoading) {
        return;
      }

      setShowExport((prev) => !prev);
      setActiveMenu(null);
    }}
    className={`flex items-center gap-1.5 rounded-lg border ${border} px-3 py-2 text-sm font-medium transition-colors ${
      isDark
        ? "bg-white/5 text-gray-300 hover:bg-white/10"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    } ${
      exportLoading
        ? "cursor-not-allowed opacity-70"
        : ""
    }`}
  >
    {exportLoading ? (
      <Loader2
        size={14}
        className="animate-spin"
      />
    ) : (
      <Upload size={14} />
    )}

    <span>
      {exportLoading
        ? "Exporting..."
        : "Export"}
    </span>

    {!exportLoading && (
      <ChevronDown
        size={14}
        className={`transition-transform ${
          showExport
            ? "rotate-180"
            : ""
        }`}
      />
    )}
  </button>

  {/* =================================================
      DROPDOWN
  ================================================= */}

  {mounted &&
    showExport &&
    !exportLoading &&
    createPortal(
      <div
        ref={dropdownRef}
        style={popupStyle}
        className={`rounded-lg border ${border} ${t.cardBg} shadow-xl overflow-visible`}
      >
        {/* =================================================
            FULL DATA
        ================================================= */}

        <MenuButton
          icon={<Database size={16} />}
          text="Full Data"
          hasArrow
          disabled={exportLoading}
          onClick={() => {
            if (exportLoading) {
              return;
            }

            setActiveMenu(
              activeMenu === "full"
                ? null
                : "full"
            );
          }}
          t={t}
        />

        {/* FULL DATA SUBMENU */}

        {activeMenu === "full" && (
          <ExportFormatMenu
            onSelect={(format) => {
              handleFullData(format);
              closeMenu();
            }}
            t={t}
            border={border}
            disabled={exportLoading}
          />
        )}

        {/* =================================================
            SELECTED PAGES
        ================================================= */}

        <MenuButton
          icon={<Files size={16} />}
          text="Selected Pages"
          hasArrow
          disabled={exportLoading}
          onClick={() => {
            if (exportLoading) {
              return;
            }

            setActiveMenu(
              activeMenu === "selected"
                ? null
                : "selected"
            );
          }}
          t={t}
        />

        {/* =================================================
            SELECTED PAGES SUBMENU
        ================================================= */}

        {activeMenu === "selected" && (
          <div
            className={`ml-2 border-l ${border} pl-2 py-2`}
          >
            {/* PAGE RANGE */}

            <div className="px-3 pb-3">
              <div
                className={`mb-2 text-xs font-semibold ${t.textPrimary}`}
              >
                Page Range
              </div>

              <div className="flex items-center gap-2">
  {/* FROM */}
  <div className="flex-1">
    <label
      className={`mb-1 block text-[11px] ${t.textSecondary}`}
    >
      From
    </label>

    <input
      type="number"
      min={1}
      max={pageCount}
      list="export-page-options"
      value={fromPage}
      disabled={exportLoading}
      onChange={(e) =>
        handleFromPageChange(e.target.value)
      }
      className={`w-full rounded border ${border} px-2 py-1.5 text-xs outline-none`}
      placeholder="Page"
    />
  </div>

  {/* TO */}
  <div className="flex-1">
    <label
      className={`mb-1 block text-[11px] ${t.textSecondary}`}
    >
      To
    </label>

    <input
      type="number"
      min={1}
      max={pageCount}
      list="export-page-options"
      value={toPage}
      disabled={exportLoading}
      onChange={(e) =>
        handleToPageChange(e.target.value)
      }
      className={`w-full rounded border ${border} px-2 py-1.5 text-xs outline-none`}
      placeholder="Page"
    />
  </div>

  {/* PAGE DROPDOWN OPTIONS */}
  <datalist id="export-page-options">
    {Array.from(
      { length: pageCount },
      (_, index) => index + 1
    ).map((page) => (
      <option
        key={page}
        value={page}
      />
    ))}
  </datalist>
</div>
            </div>

            {/* EXPORT FORMATS */}

            <ExportFormatMenu
              onSelect={handleSelectedExport}
              t={t}
              border={border}
              disabled={exportLoading}
            />
          </div>
        )}
      </div>,
      document.body
    )}
</>

);
}

/* =========================================================
FORMAT MENU
========================================================= */

function ExportFormatMenu({
onSelect,
t,
border,
disabled = false,
}) {
return (
<div
className={`border-t ${border} pt-1`}
>
{/* COPY */}

  <MenuButton
    icon={<Copy size={16} />}
    text="Copy"
    onClick={() => {
      if (!disabled) {
        onSelect("copy");
      }
    }}
    t={t}
    disabled={disabled}
  />

  {/* PRINT */}

  <MenuButton
    icon={<Printer size={16} />}
    text="Print"
    onClick={() => {
      if (!disabled) {
        onSelect("print");
      }
    }}
    t={t}
    disabled={disabled}
  />

  {/* PDF */}

  <MenuButton
    icon={<FileText size={16} />}
    text="PDF"
    onClick={() => {
      if (!disabled) {
        onSelect("pdf");
      }
    }}
    t={t}
    disabled={disabled}
  />

  {/* CSV */}

  <MenuButton
    icon={<FileSpreadsheet size={16} />}
    text="CSV"
    onClick={() => {
      if (!disabled) {
        onSelect("csv");
      }
    }}
    t={t}
    disabled={disabled}
  />
</div>

);
}

/* =========================================================
MENU BUTTON
========================================================= */

function MenuButton({
icon,
text,
onClick,
t,
hasArrow = false,
disabled = false,
}) {
return (
<button
type="button"
disabled={disabled}
onClick={onClick}
className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-sm ${
        t.textPrimary
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-red-50"
      }`}
> <span className="flex items-center gap-2">
{icon}
{text} </span>

  {hasArrow && (
    <ChevronRight size={14} />
  )}
</button>

);
}
