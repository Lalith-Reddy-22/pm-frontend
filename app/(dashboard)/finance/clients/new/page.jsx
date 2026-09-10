"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Plus, X } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import axiosClient from "@/services/axiosClient";

export default function NewClientPage() {
  const { t } = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CREATE CLIENT
  // POST /api/v1/finance-client
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // Validate client name
    if (!form.name.trim()) {
      setError("Client name is required.");
      return;
    }

    try {
      setLoading(true);

      // Get logged-in employee ID
      const createdBy = Number(
        sessionStorage.getItem("empId") || 0
      );

      const payload = {
        clientId: 0,
        clientName: form.name.trim(),
        description: form.description.trim(),
        createdBy: createdBy,
        action: "create",
      };

      console.log("CREATE CLIENT REQUEST:", payload);

      // API call
      const response = await axiosClient.post(
        "/finance-client",
        payload
      );

      console.log(
        "CREATE CLIENT API RESPONSE:",
        response.data
      );

      // API response:
      // {
      //   success: true,
      //   message: "Client created successfully."
      // }

      if (response.data?.success) {
        alert(
          response.data?.message ||
            "Client created successfully."
        );

        // Go back to client list
        router.push("/finance/clients");
      } else {
        setError(
          response.data?.message ||
            "Failed to create client."
        );
      }
    } catch (error) {
      console.error(
        "CREATE CLIENT API ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to create client."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${t.mainBg} min-h-screen px-6 py-6`}>
      {/* =====================================================
          BACK BUTTON
      ===================================================== */}
      <button
        type="button"
        onClick={() => router.push("/finance/clients")}
        disabled={loading}
        className="flex items-center gap-1.5 text-sm mb-6 text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </button>

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`p-3 rounded-xl ${t.clientIconBg}`}
        >
          <Building2 className="w-7 h-7 text-red-500" />
        </div>

        <div>
          <h1
            className={`text-2xl font-bold ${t.textPrimary}`}
          >
            Add New Client
          </h1>
        </div>
      </div>

      {/* =====================================================
          CARD
      ===================================================== */}
      <div
        className={`${t.cardBg} ${t.cardShadow} rounded-2xl p-6 max-w-2xl mx-auto`}
      >
        {/* =====================================================
            SECTION TITLE
        ===================================================== */}
        <div
          className={`flex items-center gap-3 pb-4 mb-6 border-b ${t.clientBorder}`}
        >
          <div
            className={`p-2 rounded-lg ${t.clientMutedBg}`}
          >
            <Building2 className="w-5 h-5 text-red-500" />
          </div>

          <span
            className={`font-semibold ${t.textPrimary}`}
          >
            Client Information
          </span>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* =====================================================
              CLIENT NAME
          ===================================================== */}
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}
            >
              Client Name{" "}
              <span className="text-red-500">*</span>
            </label>

            <div
              className={`flex items-center gap-2 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}
            >
              <Building2 className="w-4 h-4 text-red-500 shrink-0" />

              <input
                type="text"
                required
                disabled={loading}
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Enter client name"
                className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText} disabled:opacity-50`}
              />
            </div>
          </div>

          {/* =====================================================
              DESCRIPTION
          ===================================================== */}
          <div>
            <label
              className={`block text-sm font-medium mb-1.5 ${t.textPrimary}`}
            >
              Description
            </label>

            <div
              className={`flex gap-2 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}
            >
              <Building2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />

              <textarea
                rows={4}
                disabled={loading}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Provide a short description about the client or organization..."
                className={`flex-1 bg-transparent outline-none text-sm resize-none ${t.clientInputText} disabled:opacity-50`}
              />
            </div>
          </div>

          {/* =====================================================
              ERROR MESSAGE
          ===================================================== */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =====================================================
              ACTIONS
          ===================================================== */}
          <div
            className={`flex justify-between pt-4 border-t ${t.clientBorder}`}
          >
            {/* Cancel */}
            <button
              type="button"
              onClick={() =>
                router.push("/finance/clients")
              }
              disabled={loading}
              className={`flex items-center gap-1.5 px-4 py-2 border ${t.clientBorder} rounded-lg text-sm ${t.clientMutedText} ${t.clientRowHover} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            {/* Create */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />

              {loading ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}