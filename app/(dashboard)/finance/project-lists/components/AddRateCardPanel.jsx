"use client";

import { X, Plus, FolderOpen, Users, DollarSign, Loader2, Search } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { getRateCardProjects, getRateCardBuyingCenter, getRateCardEmployees, saveRateCardBuyingCenter, updateRateCardBuyingCenter } from "@/services/financeClientService";
import SmartSelect from "@/app/components/SmartSelect";

// Mirrors the Field wrapper used in AddProject
function Field({ label, icon: Icon, children, t }) {
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${t.textMuted}`}>{label}</label>
      <div
        className={`flex items-center gap-1.5 border ${t.clientBorder} rounded-lg px-2.5 py-1.5 ${t.clientInputBg}`}
      >
        {Icon && <Icon className="w-3 h-3 text-red-500 shrink-0" />}
        {children}
      </div>
    </div>
  );
}

export default function AddRateCardPanel({ onClose }) {
  const { t } = useTheme();

  const [projects, setProjects]               = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectId, setProjectId]             = useState("");
  const [buyingCenter, setBuyingCenter]       = useState("");
  const [employees, setEmployees]             = useState([{ empId: null, employee: "", value: "", dupError: false }]);
  // full employee list from the API — used for every row's SmartSelect dropdown
  const [employeeOpts, setEmployeeOpts]       = useState([]);
  const [loadingBC, setLoadingBC]             = useState(false);
  const [empSearch, setEmpSearch]             = useState("");
  // snapshot of employees as loaded from the API — used to detect new/edited rows
  const originalEmployees                     = useRef([]);
  const [saving, setSaving]                   = useState(false);
  const [submitError, setSubmitError]         = useState("");

  // Load projects + global employee list in parallel on mount
  useEffect(() => {
    Promise.all([
      getRateCardProjects().catch(() => []),
      getRateCardEmployees().catch(() => []),
    ]).then(([projData, empData]) => {
      setProjects(projData ?? []);
      setEmployeeOpts(
        (empData ?? []).map((e) => ({ value: String(e.empId), label: e.employee_Name }))
      );
    }).finally(() => setLoadingProjects(false));
  }, []);

  const projectOptions = projects.map((p) => ({
    value: String(p.projectId),
    label: p.projectName,
  }));

  // When a project is selected fetch its buying center details
  const handleProjectChange = async (id) => {
    setProjectId(id);
    setBuyingCenter("");
    setEmployees([{ empId: null, employee: "", value: "" }]);
    setEmpSearch("");
    setSubmitError("");
    originalEmployees.current = [];

    if (!id) return;

    setLoadingBC(true);
    try {
      const data = await getRateCardBuyingCenter(id);

      // Response shape: { buyingCenterName, employees: [...] }
      const bcName  = data?.buyingCenterName ?? "";
      const empList = data?.employees ?? [];

      setBuyingCenter(bcName);

      if (empList.length > 0) {
        const rows = empList.map((e) => ({
          empId:    e.emp_Id,
          employee: String(e.emp_Id),
          value:    String(e.emp_Value),
          dupError: false,
        }));
        setEmployees(rows);
        originalEmployees.current = rows.map((r) => ({ ...r })); // snapshot
      } else {
        setEmployees([{ empId: null, employee: "", value: "", dupError: false }]);
        originalEmployees.current = [];
      }
    } catch {
      setEmployees([{ empId: null, employee: "", value: "", dupError: false }]);
      setEmployeeOpts([]);
    } finally {
      setLoadingBC(false);
    }
  };

  const addRow = () =>
    setEmployees((prev) => [...prev, { empId: null, employee: "", value: "", dupError: false }]);

  // When changing the employee selection, check for duplicates across all rows
  const updateRow = (i, k, v) => {
    setEmployees((prev) => {
      const next = prev.map((r, idx) => (idx === i ? { ...r, [k]: v, dupError: false } : r));

      if (k === "employee" && v) {
        const isDup = next.some((r, idx) => idx !== i && r.employee === v);
        if (isDup) {
          next[i] = { ...next[i], dupError: true };
        }
      }

      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitError("");

    if (!projectId)    { setSubmitError("Please select a project."); return; }
    if (!buyingCenter) { setSubmitError("Buying center name is required."); return; }

    // Block if any row has a duplicate error
    if (employees.some((r) => r.dupError)) {
      setSubmitError("Please fix duplicate employees before saving.");
      return;
    }

    const userId = typeof window !== "undefined"
      ? Number(sessionStorage.getItem("empId") ?? 0)
      : 0;

    const origMap = new Map(
      originalEmployees.current.map((r) => [String(r.empId), r.value])
    );

    const filledRows = employees.filter((r) => r.employee);

    // New rows: empId was null when first loaded (freshly picked from the dropdown)
    const newEmpSets = filledRows
      .filter((r) => {
        const empIdStr = String(r.empId ?? r.employee);
        return !origMap.has(empIdStr);
      })
      .map((r) => ({
        empId:    Number(r.empId ?? r.employee),
        projId:   Number(projectId),
        empValue: Number(r.value) || 0,
      }));

    // Edited rows: existed in the original snapshot but emp_Value changed
    const editedEmpSets = filledRows
      .filter((r) => {
        const empIdStr = String(r.empId ?? r.employee);
        return origMap.has(empIdStr) && origMap.get(empIdStr) !== r.value;
      })
      .map((r) => ({
        empId:    Number(r.empId ?? r.employee),
        projId:   Number(projectId),
        empValue: Number(r.value) || 0,
      }));

    if (newEmpSets.length === 0 && editedEmpSets.length === 0) {
      setSubmitError("No new or edited employees to save.");
      return;
    }

    const basePayload = {
      buying_CenterName: buyingCenter,
      userId,
      action: "string",
    };

    setSaving(true);
    try {
      // POST for new employees, PUT for edited employees — run in parallel when both exist
      await Promise.all([
        newEmpSets.length > 0
          ? saveRateCardBuyingCenter({ ...basePayload, empSets: newEmpSets })
          : null,
        editedEmpSets.length > 0
          ? updateRateCardBuyingCenter({ ...basePayload, empSets: editedEmpSets })
          : null,
      ].filter(Boolean));
      onClose();
    } catch (e) {
      const errData = e.response?.data;
      setSubmitError(
        errData?.message || errData?.title || e.message || "Failed to save. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative w-[480px] h-full ${t.clientInputBg} shadow-2xl flex flex-col`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.clientBorder} shrink-0`}>
          <h2 className={`text-base font-semibold ${t.clientInputText}`}>Add buying center details</h2>
          <button onClick={onClose} className={`${t.textMuted} hover:text-red-500 transition-colors`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto flex-1">

          {/* Project */}
          <div>
            <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide uppercase`}>Project</p>
            <div
              className={`flex items-center gap-1.5 border ${t.clientBorder} rounded-lg px-2.5 py-1.5 ${t.clientInputBg}`}
            >
              <FolderOpen className="w-3 h-3 text-red-500 shrink-0" />
              {loadingProjects ? (
                <span className={`flex-1 text-xs ${t.textMuted}`}>Loading projects…</span>
              ) : (
                <SmartSelect
                  value={projectId}
                  onChange={handleProjectChange}
                  options={projectOptions}
                  placeholder="Please select Project"
                />
              )}
            </div>
          </div>

          {/* Buying Center Name */}
          <div>
            <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide uppercase`}>Buying Center Name</p>
            <div
              className={`flex items-center gap-1.5 border ${t.clientBorder} rounded-lg px-2.5 py-1.5 ${t.clientInputBg}`}
            >
              {loadingBC ? (
                <Loader2 className="w-3 h-3 text-red-400 animate-spin" />
              ) : (
                <input
                  type="text"
                  value={buyingCenter}
                  onChange={(e) => setBuyingCenter(e.target.value)}
                  placeholder="Enter buying center name"
                  className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`}
                />
              )}
            </div>
          </div>

          {/* Employee search */}
          {!loadingBC && employees.some((r) => r.employee) && (
            <div>
              <p className={`text-xs font-semibold ${t.textMuted} mb-1.5 tracking-wide uppercase`}>
                Search Employee
              </p>
              <div className={`flex items-center gap-1.5 border ${t.clientBorder} rounded-lg px-2.5 py-1.5 ${t.clientInputBg}`}>
                <Search className="w-3 h-3 text-red-500 shrink-0" />
                <input
                  type="text"
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  placeholder="Type employee name to check…"
                  className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`}
                />
                {empSearch && (
                  <button
                    type="button"
                    onClick={() => setEmpSearch("")}
                    className={`${t.textMuted} hover:text-red-500 transition-colors`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Result feedback */}
              {empSearch.trim() && (() => {
                const query = empSearch.trim().toLowerCase();
                const match = employees.find((r) => {
                  const label = employeeOpts.find((o) => o.value === r.employee)?.label ?? "";
                  return label.toLowerCase().includes(query);
                });
                return match ? (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400 pl-0.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                    {employeeOpts.find((o) => o.value === match.employee)?.label} is already present
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-red-500 pl-0.5 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    No matching employee found in this buying center
                  </p>
                );
              })()}
            </div>
          )}

          {/* Employee rows */}
          <div className="flex flex-col gap-3">
            {loadingBC ? (
              <div className="flex items-center gap-2 py-3">
                <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                <span className={`text-xs ${t.textMuted}`}>Loading employees…</span>
              </div>
            ) : (() => {
                // When searching, float matched rows to the top for rendering only
                const query = empSearch.trim().toLowerCase();
                const sorted = query
                  ? [...employees].sort((a, b) => {
                      const labelA = employeeOpts.find((o) => o.value === a.employee)?.label ?? "";
                      const labelB = employeeOpts.find((o) => o.value === b.employee)?.label ?? "";
                      const aMatch = labelA.toLowerCase().includes(query);
                      const bMatch = labelB.toLowerCase().includes(query);
                      if (aMatch && !bMatch) return -1;
                      if (!aMatch && bMatch) return 1;
                      return 0;
                    })
                  : employees;

                // Map back to original index so updateRow still targets the right slot
                const withOrigIdx = sorted.map((row) => ({
                  row,
                  origIdx: employees.indexOf(row),
                }));

                return withOrigIdx.map(({ row, origIdx }, displayIdx) => {
                  const label      = employeeOpts.find((o) => o.value === row.employee)?.label ?? "";
                  const isHighlighted = query && label.toLowerCase().includes(query);

                  return (
                    <div
                      key={origIdx}
                      className={isHighlighted ? `rounded-lg p-2 -mx-2 ring-1 ring-red-400 ${t.clientInputBg}` : ""}
                    >
                      <p className={`text-xs font-semibold mb-1.5 tracking-wide uppercase ${
                        isHighlighted ? "text-red-500" : t.textMuted
                      }`}>
                        Employee {origIdx + 1}
                        {isHighlighted && (
                          <span className="ml-1.5 normal-case font-normal text-red-400">↑ matched</span>
                        )}
                      </p>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">

                          {/* Employee dropdown */}
                          <div
                            className={`flex-1 flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 ${t.clientInputBg} ${
                              row.dupError ? "border-red-500" : isHighlighted ? "border-red-400" : t.clientBorder
                            }`}
                          >
                            <Users className="w-3 h-3 text-red-500 shrink-0" />
                            <SmartSelect
                              value={row.employee}
                              onChange={(v) => updateRow(origIdx, "employee", v)}
                              options={employeeOpts}
                              placeholder="Select Employee"
                            />
                          </div>

                          {/* Rate value */}
                          <div
                            className={`w-28 flex items-center border ${t.clientBorder} rounded-lg px-2.5 py-1.5 ${t.clientInputBg}`}
                          >
                            <input
                              type="number"
                              value={row.value}
                              onChange={(e) => updateRow(origIdx, "value", e.target.value)}
                              placeholder="0"
                              className={`w-full bg-transparent outline-none text-xs ${t.clientInputText}`}
                            />
                          </div>

                          {/* Add row — only on the last display row */}
                          {displayIdx === withOrigIdx.length - 1 && (
                            <button
                              type="button"
                              onClick={addRow}
                              className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shrink-0 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Duplicate error */}
                        {row.dupError && (
                          <p className="text-xs text-red-500 pl-0.5">Employee already present</p>
                        )}
                      </div>
                    </div>
                  );
                });
              })()
            }
          </div>

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${t.clientBorder} shrink-0 flex flex-col gap-2 items-start`}>
          {submitError && (
            <p className="text-xs text-red-500">{submitError}</p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-colors flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? "Saving…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
