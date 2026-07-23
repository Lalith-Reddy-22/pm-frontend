"use client";

import { X, Plus } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import { useState } from "react";
import { PROJECTS, BUYING_CENTERS } from "../data";

const ALL_EMPLOYEES = ["Suresh Waghmore", "Shijin Pulikkotil", "Hari Prabhakaran", "Sunil Kadhamba",
  "Binoj", "Pavithra G", "Rajesh Hariharan", "Vishwanath BJ", "Sonali Sulakhe", "Shuja Jacob"];

export default function AddRateCardPanel({ onClose }) {
  const { t } = useTheme();
  const [projectId, setProjectId] = useState("");
  const [buyingCenter, setBuyingCenter] = useState("");
  const [employees, setEmployees] = useState([{ employee: "", value: "" }]);

  const handleProjectChange = (id) => {
    setProjectId(id);
    if (id && BUYING_CENTERS[id]) {
      const bc = BUYING_CENTERS[id];
      setBuyingCenter(bc.name);
      setEmployees(bc.employees.map(e => ({ employee: e.employee, value: String(e.value) })));
    } else {
      setBuyingCenter("");
      setEmployees([{ employee: "", value: "" }]);
    }
  };

  const addRow = () => setEmployees(prev => [...prev, { employee: "", value: "" }]);
  const updateRow = (i, k, v) => setEmployees(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative w-[420px] h-full ${t.clientInputBg} shadow-2xl flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.clientBorder} shrink-0`}>
          <h2 className={`text-base font-semibold ${t.clientInputText}`}>Add buying center details</h2>
          <button onClick={onClose} className={`${t.textMuted} hover:text-red-500 transition-colors`}><X className="w-4 h-4" /></button>
        </div>

        {/* Scrollable Body */}
        <div className="flex flex-col gap-5 px-6 py-5 overflow-y-auto flex-1">
          {/* Project */}
          <div>
            <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide`}>PROJECT</p>
            <div className="relative">
              <select
                value={projectId}
                onChange={e => handleProjectChange(e.target.value)}
                className={`w-full border ${t.clientBorder} rounded-lg px-3 py-2 text-sm ${t.clientInputText} ${t.clientInputBg} focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none`}
              >
                <option value="">Please select Project</option>
                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
              <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${t.textMuted}`}>▾</span>
            </div>
          </div>

          {/* Buying Center Name */}
          <div>
            <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide`}>BUYING CENTER NAME</p>
            <input
              type="text"
              value={buyingCenter}
              onChange={e => setBuyingCenter(e.target.value)}
              placeholder="BuyingCenterName"
              className={`w-full border ${t.clientBorder} rounded-lg px-3 py-2 text-sm ${t.clientInputText} ${t.clientInputBg} focus:outline-none focus:ring-2 focus:ring-red-300`}
            />
          </div>

          {/* Employee rows */}
          <div className="flex flex-col gap-3">
            {employees.map((row, i) => (
              <div key={i}>
                <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide`}>EMPLOYEE {i + 1}</p>
                <div className="flex items-center gap-2">
                  <select
                    value={row.employee}
                    onChange={e => updateRow(i, "employee", e.target.value)}
                    className={`flex-1 border ${t.clientBorder} rounded-lg px-3 py-2 text-sm ${t.clientInputText} ${t.clientInputBg} focus:outline-none focus:ring-2 focus:ring-red-300`}
                  >
                    <option value="">Select Employee</option>
                    {ALL_EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <input
                    type="number"
                    value={row.value}
                    onChange={e => updateRow(i, "value", e.target.value)}
                    placeholder="Enter Value"
                    className={`w-28 border ${t.clientBorder} rounded-lg px-3 py-2 text-sm ${t.clientInputText} ${t.clientInputBg} focus:outline-none focus:ring-2 focus:ring-red-300`}
                  />
                  {i === employees.length - 1 && (
                    <button
                      onClick={addRow}
                      className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shrink-0 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${t.clientBorder} shrink-0`}>
          <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 text-sm font-medium transition-colors">Add</button>
        </div>
      </div>
    </div>
  );
}
