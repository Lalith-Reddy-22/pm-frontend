"use client";

export default function FilterSection({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onGenerate,
}) {
  return (
    <div className="flex items-end gap-4 border-t pt-5">

      <div>
        <label className="text-xs uppercase text-gray-500 font-semibold">
          Start Date *
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border w-60 h-10 rounded px-3 mt-1"
        />
      </div>

      <div>
        <label className="text-xs uppercase text-gray-500 font-semibold">
          End Date *
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border w-60 h-10 rounded px-3 mt-1"
        />
      </div>

      <button
        onClick={onGenerate}
        className="bg-[#3b3b3b] text-white px-6 h-10 rounded"
      >
        Generate Report
      </button>

      <button
        disabled
        className="bg-gray-200 text-gray-400 px-6 h-10 rounded cursor-not-allowed"
      >
        Export to Excel
      </button>

    </div>
  );
}