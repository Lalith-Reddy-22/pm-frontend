"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, FolderOpen, Save, X, DollarSign, Calendar,
  Globe, ShoppingCart, Hash, Tag, Users, Building2,
} from "lucide-react";
import { useTheme } from "../../../../../context/ThemeContext";
import { api } from "@/lib/api";

export default function EditProjectPage() {
  const { t } = useTheme();
  const router = useRouter();
  const { projectId } = useParams();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [empId, setEmpId] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("empId");
    if (id) setEmpId(id);
    else { setError("Session expired. Please log in again."); setLoading(false); }
  }, []);

  useEffect(() => {
    if (!empId) return;
    const params = new URLSearchParams({ EmpId: empId, pageNumber: 1, pageSize: 1000 });
    api.get(`/api/v1/finance-projects?${params}`)
      .then(data => {
        const projects = data.projects ?? data ?? [];
        const p = projects.find(p => String(p.projecT_ID ?? p.project_ID) === String(projectId));
        if (!p) { setError("not_found"); return; }
        setForm({
          title:                p.project_Title ?? "",
          client:               p.client_Title  ?? "",
          region:               p.region        ?? "",
          status:               p.project_Status ?? "Active",
          projectCode:          p.projectCode   ?? "",
          type:                 p.type          ?? "Billable",
          subClient:            p.subClient     ?? "",
          projectOwner:         p.employee_Name ?? "",
          startDate:            p.pstart_date   ?? "",
          endDate:              p.end_date       ?? "",
          buyingCenter:         p.buyingCenter  ?? "",
          financialYear:        p.financial_Year ?? "",
          poValue:              p.total_Value   ?? 0,
          predictedCost:        p.predictedCost ?? 0,
          outsourcingCost:      p.outsourcing_Value ?? 0,
          includeInBuyingCenter: p.includeInBuyingCenter ?? false,
        });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [empId, projectId]);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));
  const toggle = (key) => () => setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: persist changes via API
    router.push("/finance/project-lists");
  };

  const Field = ({ label, icon: Icon, children, span }) => (
    <div className={span ? "col-span-2" : ""}>
      <label className={`block text-xs font-medium mb-1.5 ${t.textMuted}`}>{label}</label>
      <div className={`flex items-center gap-2 border ${t.clientBorder} rounded-lg px-3 py-2 ${t.clientInputBg}`}>
        {Icon && <Icon className="w-3.5 h-3.5 text-red-500 shrink-0" />}
        {children}
      </div>
    </div>
  );

  if (loading) return (
    <div className={`${t.mainBg} min-h-screen flex items-center justify-center`}>
      <p className={`${t.textMuted} text-sm`}>Loading...</p>
    </div>
  );

  if (error === "not_found" || !form) return (
    <div className={`${t.mainBg} min-h-screen flex items-center justify-center`}>
      <p className={`${t.textMuted} text-sm`}>Project not found.</p>
    </div>
  );

  if (error) return (
    <div className={`${t.mainBg} min-h-screen flex items-center justify-center`}>
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  return (
    <div className={`${t.mainBg} min-h-screen px-6 py-6`}>
      <button
        onClick={() => router.push("/finance/project-lists")}
        className="flex items-center gap-1.5 text-sm mb-6 text-red-500 hover:text-red-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Project Lists
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${t.clientIconBg}`}>
          <FolderOpen className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className={`text-xl font-bold ${t.textPrimary}`}>Edit Project</h1>
          <p className={`text-xs ${t.textMuted} mt-0.5 max-w-2xl truncate`}>{form.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-5 items-start">

          {/* ── LEFT: Project Information ── */}
          <div className={`${t.cardBg} ${t.cardShadow} rounded-2xl p-6`}>
            <div className={`flex items-center gap-3 pb-4 mb-5 border-b ${t.clientBorder}`}>
              <div className={`p-2 rounded-lg ${t.clientMutedBg}`}>
                <FolderOpen className="w-4 h-4 text-red-500" />
              </div>
              <span className={`font-semibold text-sm ${t.textPrimary}`}>Project Information</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Project Name" icon={FolderOpen} span>
                <input required value={form.title} onChange={set("title")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Region" icon={Globe}>
                <input value={form.region} onChange={set("region")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Project Status" icon={Tag}>
                <select value={form.status} onChange={set("status")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`}>
                  <option>Active</option><option>Inactive</option><option>Completed</option><option>On Hold</option>
                </select>
              </Field>
              <Field label="Client" icon={Building2}>
                <input value={form.client} onChange={set("client")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Project Code" icon={Hash}>
                <input value={form.projectCode} onChange={set("projectCode")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Type" icon={Tag}>
                <select value={form.type} onChange={set("type")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`}>
                  <option>Billable</option><option>Non-Billable</option><option>Internal</option>
                </select>
              </Field>
              <Field label="SubClient" icon={Building2}>
                <input value={form.subClient} onChange={set("subClient")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Start Date" icon={Calendar}>
                <input type="date" value={form.startDate} onChange={set("startDate")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="End Date" icon={Calendar}>
                <input type="date" value={form.endDate} onChange={set("endDate")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Project Owner" icon={Users} span>
                <input value={form.projectOwner} onChange={set("projectOwner")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
            </div>
          </div>

          {/* ── RIGHT: Budget Details ── */}
          <div className={`${t.cardBg} ${t.cardShadow} rounded-2xl p-6`}>
            <div className={`flex items-center justify-between pb-4 mb-5 border-b ${t.clientBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${t.clientMutedBg}`}>
                  <DollarSign className="w-4 h-4 text-red-500" />
                </div>
                <span className={`font-semibold text-sm ${t.textPrimary}`}>Budget Details</span>
              </div>
              <button type="button" onClick={toggle("includeInBuyingCenter")} className="flex items-center gap-2 group">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  form.includeInBuyingCenter ? "bg-red-600 border-red-600" : `border-gray-400 ${t.clientInputBg}`
                }`}>
                  {form.includeInBuyingCenter && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-medium ${t.textPrimary} flex items-center gap-1`}>
                  <ShoppingCart className="w-3.5 h-3.5 text-red-500" /> Include Buying Center
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Buying Center" icon={ShoppingCart} span>
                <input value={form.buyingCenter} onChange={set("buyingCenter")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Financial Year" icon={Calendar} span>
                <select value={form.financialYear} onChange={set("financialYear")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`}>
                  <option>CY-2026</option><option>CY-2025</option><option>CY-2024</option>
                  <option>FY-2026-2027</option><option>FY-2025-2026</option>
                </select>
              </Field>
              <Field label="Purchase Order Value ($)" icon={DollarSign} span>
                <input type="number" value={form.poValue} onChange={set("poValue")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Predicted Cost ($)" icon={DollarSign} span>
                <input type="number" value={form.predictedCost} onChange={set("predictedCost")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
              <Field label="Outsourcing Cost ($)" icon={DollarSign} span>
                <input type="number" value={form.outsourcingCost} onChange={set("outsourcingCost")} className={`flex-1 bg-transparent outline-none text-sm ${t.clientInputText}`} />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-1">
          <button
            type="button"
            onClick={() => router.push("/finance/project-lists")}
            className={`flex items-center gap-1.5 px-4 py-2 border ${t.clientBorder} rounded-lg text-sm ${t.clientMutedText} ${t.clientRowHover}`}
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
