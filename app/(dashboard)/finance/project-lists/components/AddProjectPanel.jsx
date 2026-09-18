"use client";

import { X } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import { useState } from "react";

export default function AddProjectPanel({ onClose }) {
  const { t } = useTheme();
  const [form, setForm] = useState({ name: "", client: "", startDate: "", endDate: "", region: "", poValue: "", description: "" });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative w-[420px] h-full ${t.clientInputBg} shadow-2xl flex flex-col overflow-y-auto`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.clientBorder}`}>
          <h2 className={`text-base font-semibold ${t.clientInputText}`}>Add Project</h2>
          <button onClick={onClose} className={`${t.textMuted} hover:text-red-500 transition-colors`}><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-6 py-5">
          {[
            { label: "PROJECT NAME", key: "name", placeholder: "Enter project name" },
            { label: "CLIENT", key: "client", placeholder: "Enter client name" },
            { label: "REGION", key: "region", placeholder: "e.g. US, EU" },
            { label: "PO VALUE ($)", key: "poValue", placeholder: "0.00", type: "number" },
            { label: "START DATE", key: "startDate", type: "date" },
            { label: "END DATE", key: "endDate", type: "date" },
          ].map(({ label, key, placeholder, type = "text" }) => (
            <div key={key}>
              <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide`}>{label}</p>
              <input
                type={type}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className={`w-full border ${t.clientBorder} rounded-lg px-3 py-2 text-sm ${t.clientInputText} ${t.clientInputBg} focus:outline-none focus:ring-2 focus:ring-red-300`}
              />
            </div>
          ))}

          <div>
            <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide`}>DESCRIPTION</p>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Enter project description"
              className={`w-full border ${t.clientBorder} rounded-lg px-3 py-2 text-sm ${t.clientInputText} ${t.clientInputBg} focus:outline-none focus:ring-2 focus:ring-red-300 resize-none`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-auto px-6 py-4 border-t ${t.clientBorder} flex gap-3`}>
          <button onClick={onClose} className={`flex-1 border ${t.clientBorder} rounded-lg py-2 text-sm ${t.clientInputText} hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors`}>Cancel</button>
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-medium transition-colors">Add</button>
        </div>
      </div>
    </div>
  );
}
