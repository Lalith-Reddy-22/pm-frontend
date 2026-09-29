"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Tag, List, AlertTriangle, AlignLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/app/context/ThemeContext";
import SmartSelect from "@/app/components/SmartSelect";

// Matches the Field wrapper from AddProject
function Field({ label, icon: Icon, children, t, alignStart = false }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${t.textMuted}`}>{label}</label>
      <div className={`flex ${alignStart ? "items-start" : "items-center"} gap-2 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}>
        {Icon && <Icon className={`w-4 h-4 text-red-500 shrink-0 ${alignStart ? "mt-0.5" : ""}`} />}
        {children}
      </div>
    </div>
  );
}

export default function CreateTicketModal({ open, onClose }) {
  const { t } = useTheme();

  // ── form state ──────────────────────────────────────────────────────────────
  const [issueTypeId, setIssueTypeId]     = useState("");
  const [subIssueTypeId, setSubIssueTypeId] = useState("");
  const [severityId, setSeverityId]       = useState("");
  const [description, setDescription]     = useState("");

  // ── API data ────────────────────────────────────────────────────────────────
  const [issueTypes, setIssueTypes]   = useState([]);
  const [severities, setSeverities]   = useState([]);
  const [subIssues, setSubIssues]     = useState([]);

  const [loading, setLoading]         = useState(false);
  const [subLoading, setSubLoading]   = useState(false);
  const [error, setError]             = useState(null);

  // Fetch form-data (types + severities) when drawer opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get("/ticket/form-data")
      .then((data) => {
        if (cancelled) return;
        setIssueTypes(data?.issueTypes ?? []);
        setSeverities(data?.severities ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Failed to load form options.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [open]);

  // Fetch sub-issues whenever issueTypeId changes
  useEffect(() => {
    if (!issueTypeId) { setSubIssues([]); return; }

    let cancelled = false;
    setSubLoading(true);
    setSubIssueTypeId("");

    api
      .get(`/ticket/sub-issues?issueTypeId=${issueTypeId}`)
      .then((data) => {
        if (!cancelled) setSubIssues(Array.isArray(data) ? data : []);
      })
      .catch(() => { if (!cancelled) setSubIssues([]); })
      .finally(() => { if (!cancelled) setSubLoading(false); });

    return () => { cancelled = true; };
  }, [issueTypeId]);

  // ── derived options for SmartSelect ────────────────────────────────────────
  const typeOptions     = issueTypes.map((t) => ({ value: String(t.id), label: t.issue_Type }));
  const subTypeOptions  = subIssues.map((s)  => ({ value: String(s.id), label: s.subcategory }));
  const severityOptions = severities.map((s) => ({ value: String(s.id), label: s.severity }));

  const OPEN_STATUS_ID = 1; // from form-data API: { id: 1, status: "Open" }

  // ── actions ─────────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!issueTypeId || !subIssueTypeId || !severityId) {
      setError("Please fill in all required fields.");
      return;
    }

    const empId = typeof window !== "undefined"
      ? Number(sessionStorage.getItem("empId") || 0)
      : 0;

    const payload = {
      issueType:        Number(issueTypeId),
      subIssueType:     Number(subIssueTypeId),
      severity:         Number(severityId),
      issueDescription: description.trim() || null,
      empId,
      status:           OPEN_STATUS_ID,
    };

    setSubmitting(true);
    setError(null);

    try {
      await api.post("/ticket", payload);
      handleClose();
    } catch (err) {
      setError(err.message ?? "Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setIssueTypeId("");
    setSubIssueTypeId("");
    setSeverityId("");
    setDescription("");
    setSubIssues([]);
    onClose();
  }

  if (!open) return null;

  const drawer = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-[420px] flex-col ${t.cardBg} shadow-2xl`}>

        {/* Header */}
        <div className={`flex items-center justify-between border-b ${t.clientBorder} px-6 py-5`}>
          <h2 className={`text-xl font-semibold ${t.textPrimary}`}>Create Issue</h2>
          <button
            onClick={handleClose}
            className={`rounded-lg p-1.5 transition hover:bg-red-50 dark:hover:bg-red-500/10`}
          >
            <X size={20} className={t.textMuted} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* TYPE */}
          <Field t={t} label="Type" icon={Tag}>
            <SmartSelect
              value={issueTypeId}
              onChange={setIssueTypeId}
              options={typeOptions}
              placeholder={loading ? "Loading…" : "Select Type"}
            />
          </Field>

          {/* SUB ISSUE TYPE */}
          <Field t={t} label="Sub Issue Type" icon={List}>
            <SmartSelect
              value={subIssueTypeId}
              onChange={setSubIssueTypeId}
              options={subTypeOptions}
              placeholder={
                !issueTypeId ? "Select Type first" : subLoading ? "Loading…" : "Select Sub Issue Type"
              }
            />
          </Field>

          {/* SEVERITY */}
          <Field t={t} label="Severity" icon={AlertTriangle}>
            <SmartSelect
              value={severityId}
              onChange={setSeverityId}
              options={severityOptions}
              placeholder={loading ? "Loading…" : "Select Severity"}
            />
          </Field>

          {/* ISSUE DESCRIPTION */}
          <Field t={t} label="Issue Description" icon={AlignLeft} alignStart>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              placeholder="Describe your issue..."
              className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText} resize-none`}
            />
          </Field>

        </div>

        {/* Footer */}
        <div className={`border-t ${t.clientBorder} px-6 pt-4 pb-4`}>
          <button
            onClick={handleSubmit}
            disabled={loading || submitting}
            className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>

      </div>
    </>
  );

  return createPortal(drawer, document.body);
}
