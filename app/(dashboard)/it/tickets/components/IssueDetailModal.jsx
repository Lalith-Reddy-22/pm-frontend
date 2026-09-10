"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/app/context/ThemeContext";
import CustomSelect from "@/components/ui/CustomSelect";

export default function IssueDetailModal({ ticket, onClose, onUpdated }) {
  const { t } = useTheme();

  const [statuses,   setStatuses]   = useState([]);
  const [statusId,   setStatusId]   = useState("");
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (!ticket) return;
    setComment("");
    setError(null);

    api
      .get("/api/v1/ticket/form-data")
      .then((data) => {
        const list = data?.statuses ?? [];
        setStatuses(list);
        const current = list.find(
          (s) => s.status?.toLowerCase() === ticket?.status?.toLowerCase()
        );
        setStatusId(current ? String(current.id) : "");
      })
      .catch(() => {});
  }, [ticket]);

  async function handleUpdate() {
    if (!statusId) {
      setError("Please select a status.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updatedBy = typeof window !== "undefined"
        ? Number(sessionStorage.getItem("empId") || 0)
        : 0;

      await api.put("/api/v1/ticket/update-status", {
        issueId:   Number(ticket.id),
        status:    Number(statusId),
        comments:  comment.trim() || "",
        updatedBy,
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(err.message ?? "Failed to update ticket.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ticket) return null;

  // CustomSelect expects { id, name } shape
  const statusOptions = statuses.map((s) => ({ id: String(s.id), name: s.status }));

  const modal = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`relative w-full max-w-2xl rounded-2xl ${t.cardBg} shadow-2xl border ${t.clientBorder}`}>

          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-lg p-1.5 transition hover:bg-red-50 dark:hover:bg-red-500/10 ${t.textMuted}`}
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="px-10 py-10">
            <h2 className={`mb-8 text-xl font-semibold ${t.textPrimary}`}>
              Issue Details
            </h2>

            {error && (
              <p className="mb-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Issue Description (read-only) */}
            <div className="mb-6 flex items-start gap-8">
              <label className={`w-56 shrink-0 pt-2 text-sm font-medium ${t.textMuted}`}>
                Issue Description :
              </label>
              <div className={`flex-1 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}>
                <p className={`text-sm whitespace-pre-wrap ${t.clientInputText}`}>
                  {ticket.descriptionFull || ticket.description || "—"}
                </p>
              </div>
            </div>

            {/* Update Status */}
            <div className="mb-6 flex items-center gap-8">
              <label className={`w-56 shrink-0 text-sm font-medium ${t.textMuted}`}>
                Update Status :
              </label>
              <div className={`flex-1 flex items-center gap-2 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}>
                <CustomSelect
                  value={statusId}
                  onChange={setStatusId}
                  options={statusOptions}
                  placeholder="Select Status"
                />
              </div>
            </div>

            {/* Comments */}
            <div className="mb-10 flex items-start gap-8">
              <label className={`w-56 shrink-0 pt-2 text-sm font-medium ${t.textMuted}`}>
                Please add Comments if any :
              </label>
              <div className={`flex-1 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  placeholder="Add your comment here..."
                  className={`w-full resize-none bg-transparent outline-none text-sm ${t.clientInputText}`}
                />
              </div>
            </div>

            {/* Update Ticket */}
            <div className="flex justify-center">
              <button
                onClick={handleUpdate}
                disabled={submitting}
                className="rounded-lg bg-[#E12729] px-10 py-3 text-sm font-semibold text-white transition hover:bg-[#c81f21] disabled:opacity-60"
              >
                {submitting ? "Updating..." : "Update Ticket"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
