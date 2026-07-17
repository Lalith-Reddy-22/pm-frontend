"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Plus, X } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";

export default function NewClientPage() {
  const { t } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: save client
    router.push("/finance/clients");
  };

  return (
    <div className={`${t.mainBg} min-h-screen px-6 py-6`}>
      {/* Back */}
      <button
        onClick={() => router.push("/finance/clients")}
        className={`flex items-center gap-1.5 text-sm mb-6 text-red-500 hover:text-red-600`}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-xl ${t.clientIconBg}`}>
          <Building2 className="w-7 h-7 text-red-500" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Add New Client</h1>
        </div>
      </div>

      {/* Card */}
      <div className={`${t.cardBg} ${t.cardShadow} rounded-2xl p-6 max-w-2xl mx-auto`}>
        {/* Section title */}
        <div className={`flex items-center gap-3 pb-4 mb-6 border-b ${t.clientBorder}`}>
          <div className={`p-2 rounded-lg ${t.clientMutedBg}`}>
            <Building2 className="w-5 h-5 text-red-500" />
          </div>
          <span className={`font-semibold ${t.textPrimary}`}>Client Information</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Client Name */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}>
              Client Name <span className="text-red-500">*</span>
            </label>
            <div className={`flex items-center gap-2 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}>
              <Building2 className="w-4 h-4 text-red-500 shrink-0" />
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter client name"
                className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}>
              Description
            </label>
            <div className={`flex gap-2 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}>
              <Building2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Provide a short description about the client or organization..."
                className={`flex-1 bg-transparent outline-none text-sm resize-none ${t.clientInputText}`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={`flex justify-between pt-4 border-t ${t.clientBorder}`}>
            <button
              type="button"
              onClick={() => router.push("/finance/clients")}
              className={`flex items-center gap-1.5 px-4 py-2 border ${t.clientBorder} rounded-lg text-sm ${t.clientMutedText} ${t.clientRowHover}`}
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Create Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
