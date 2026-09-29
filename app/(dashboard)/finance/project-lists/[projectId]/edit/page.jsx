"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  ArrowLeft, FolderOpen, Save, DollarSign, Calendar,
  Globe, ShoppingCart, Hash, Tag, Users, Building2, Loader2,
} from "lucide-react";
import { useTheme } from "../../../../../context/ThemeContext";
import {
  getFinanceProjectById,
  updateFinanceProject,
  getProjectLookups,
} from "@/services/financeClientService";
import SmartSelect from "@/app/components/SmartSelect";
import { clearClientsCache } from "@/store/slices/financeClientSlice";
import { clearProjects } from "@/store/slices/projectSlice";

// Defined outside the component so React sees a stable identity across renders,
// which prevents inputs from losing focus on every keystroke.
function Field({ label, icon: Icon, children, span, t }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <label className={`block text-xs font-medium mb-1 ${t.textMuted}`}>{label}</label>
      <div className={`flex items-center gap-1.5 border ${t.clientBorder} rounded-lg px-2.5 py-1.5 ${t.clientInputBg}`}>
        {Icon && <Icon className="w-3 h-3 text-red-500 shrink-0" />}
        {children}
      </div>
    </div>
  );
}

const STATUS_OPTIONS  = ["Active", "Completed", "On Hold"].map((s) => ({ value: s, label: s }));
const BILLING_OPTIONS = ["Billable", "Non-Billable", "Internal"].map((s) => ({ value: s, label: s }));

export default function EditProjectPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center gap-2 p-6 text-gray-500"><Loader2 size={16} className="animate-spin text-[#E12729]" />Loading...</div>}>
      <EditProjectPageInner />
    </Suspense>
  );
}

function EditProjectPageInner() {
  const { t } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const searchParams = useSearchParams();

  const backPath = searchParams.get("from") === "project"
    ? "/project"
    : "/finance/project-lists";

  const [form, setForm]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [clients, setClients]         = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [buyingCenters, setBuyingCenters] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);

  useEffect(() => {
    getProjectLookups()
      .then((data) => {
        setClients(data.clients ?? []);
        setEmployees(data.projectManagers ?? []);
        setBuyingCenters(data.buyingCenters ?? []);
        setFinancialYears(data.financialYears ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    getFinanceProjectById(projectId)
      .then((p) => {
        const statusMap = { 2: "Active", 4: "Inactive", 3: "Completed", 1: "On Hold" };
        const typeMap   = { 1: "Billable", 2: "Non-Billable", 3: "Internal" };
        setForm({
          title:                 p.project_Title      ?? "",
          client:                p.client_Id != null ? String(p.client_Id) : "",
          region:                p.region             ?? "",
          status:                statusMap[p.project_Status] ?? "Active",
          projectCode:           p.projectCode        ?? "",
          type:                  typeMap[p.billing_type] ?? "Billable",
          subClient:             p.sub_Client_Name    ?? "",
          projectOwner:          (p.project_manager != null && p.project_manager !== "") ? String(p.project_manager) : "",
          startDate:             p.start_date ? p.start_date.split("T")[0] : "",
          endDate:               p.end_date   ? p.end_date.split("T")[0]   : "",
          buyingCenter:          (p.b_Id != null && p.b_Id !== 0) ? String(p.b_Id) : "",
          financialYear:         p.financial_Year_Id != null ? String(p.financial_Year_Id) : "",
          poValue:               p.total_Value       != null ? String(p.total_Value)       : "",
          predictedCost:         p.predicted_Value   != null ? String(p.predicted_Value)   : "",
          outsourcingCost:       p.outsourcing_Value != null ? String(p.outsourcing_Value) : "",
          includeInBuyingCenter: p.includeInBuyingCenter ?? true,
        });
      })
      .catch((e) => setError(e.response?.data?.message || e.message || "Failed to load project."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const setField   = (key) => (e)    => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const setVal     = (key) => (val)  => setForm((prev) => ({ ...prev, [key]: val }));
  const toggle     = (key) => ()     => setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  const goBack     = () => router.push(backPath);

  const statusMap  = { Active: 2, Inactive: 4, Completed: 3, "On Hold": 1 };
  const billingMap = { Billable: 1, "Non-Billable": 2, Internal: 3 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        projectTitle:          form.title,
        clientId:              form.client      ? Number(form.client)      : null,
        region:                form.region,
        projectStatus:         statusMap[form.status]  ?? 1,
        projectCode:           form.projectCode,
        billingType:           billingMap[form.type]   ?? 1,
        subClientName:         form.subClient,
        projectManagerIds:     form.projectOwner || null,
        startDate:             form.startDate    || null,
        endDate:               form.endDate      || null,
        buyingCenterId:        form.buyingCenter  ? Number(form.buyingCenter)  : null,
        financialYearId:       form.financialYear ? Number(form.financialYear) : null,
        totalValue:            Number(form.poValue),
        predictedValue:        Number(form.predictedCost),
        outsourcingValue:      Number(form.outsourcingCost),
        includeInBuyingCenter: form.includeInBuyingCenter,
      };
      await updateFinanceProject({ projectId, payload });
      queryClient.invalidateQueries({ queryKey: ["financeProjects"] });
      dispatch(clearClientsCache());
      dispatch(clearProjects());
      router.push(backPath);
    } catch (e) {
      const errData = e.response?.data;
      const msg =
        errData?.errors
          ? Object.entries(errData.errors).map(([k, v]) => `${k}: ${[v].flat().join(", ")}`).join(" | ")
          : errData?.title || errData?.detail || errData?.message || e.message || "Failed to save. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className={`${t.mainBg} h-full flex items-center justify-center`}>
      <p className={`${t.textMuted} text-sm`}>Loading project...</p>
    </div>
  );

  if (error && !form) return (
    <div className={`${t.mainBg} h-full flex items-center justify-center flex-col gap-3`}>
      <p className="text-red-500 text-sm">{error}</p>
      <button onClick={goBack} className="text-sm text-red-500 hover:text-red-600">← Back to Project Lists</button>
    </div>
  );

  if (!form) return (
    <div className={`${t.mainBg} h-full flex items-center justify-center`}>
      <p className={`${t.textMuted} text-sm`}>Project not found.</p>
    </div>
  );

  const clientOptions      = clients.map((c) => ({ value: String(c.client_ID), label: c.client_Title }));
  const employeeOptions    = employees.map((e) => ({ value: String(e.empId), label: e.employee_Name }));
  const buyingCtrOptions   = buyingCenters.map((bc) => ({ value: String(bc.bId), label: bc.bName }));
  const financialYrOptions = financialYears.map((y) => ({ value: String(y.id), label: y.financial_Year }));

  return (
    <div className={`${t.mainBg} h-full flex flex-col overflow-hidden`}>

      {/* ── Top bar ── */}
      <div className="shrink-0 px-6 pt-4 pb-3">
        <button onClick={goBack} className="flex items-center gap-1.5 text-sm mb-3 text-red-500 hover:text-red-600">
          <ArrowLeft className="w-4 h-4" />
          {searchParams.get("from") === "project" ? "Back to Projects" : "Back to Project Lists"}
        </button>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${t.clientIconBg}`}>
            <FolderOpen className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className={`text-base font-bold ${t.textPrimary}`}>Edit Project</h1>
            <p className={`text-xs ${t.textMuted} mt-0.5 max-w-2xl truncate`}>{form.title}</p>
          </div>
        </div>
        {error && (
          <div className="mt-3 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* ── Form body ── */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden px-6 pb-4">
        <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden min-h-0">

          {/* ── LEFT: Project Information ── */}
          <div className={`${t.cardBg} ${t.cardShadow} rounded-2xl flex flex-col overflow-hidden min-h-0`}>
            <div className={`shrink-0 flex items-center gap-3 px-5 py-3 border-b ${t.clientBorder}`}>
              <div className={`p-1.5 rounded-lg ${t.clientMutedBg}`}>
                <FolderOpen className="w-3.5 h-3.5 text-red-500" />
              </div>
              <span className={`font-semibold text-sm ${t.textPrimary}`}>Project Information</span>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-2 gap-3">

                <Field t={t} label="Project Name" icon={FolderOpen} span>
                  <input required value={form.title} onChange={setField("title")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Region" icon={Globe}>
                  <input value={form.region} onChange={setField("region")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Project Status" icon={Tag}>
                  <SmartSelect
                    value={form.status}
                    onChange={setVal("status")}
                    options={STATUS_OPTIONS}
                    placeholder="Select status"
                  />
                </Field>

                <Field t={t} label="Client" icon={Building2}>
                  <SmartSelect
                    value={form.client}
                    onChange={setVal("client")}
                    options={clientOptions}
                    placeholder="— Select client —"
                  />
                </Field>

                <Field t={t} label="Project Code" icon={Hash}>
                  <input value={form.projectCode} onChange={setField("projectCode")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Type" icon={Tag}>
                  <SmartSelect
                    value={form.type}
                    onChange={setVal("type")}
                    options={BILLING_OPTIONS}
                    placeholder="Select type"
                  />
                </Field>

                <Field t={t} label="SubClient" icon={Building2}>
                  <input value={form.subClient} onChange={setField("subClient")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Start Date" icon={Calendar}>
                  <input type="date" value={form.startDate} onChange={setField("startDate")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="End Date" icon={Calendar}>
                  <input type="date" value={form.endDate} onChange={setField("endDate")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Project Owner" icon={Users} span>
                  <SmartSelect
                    value={form.projectOwner}
                    onChange={setVal("projectOwner")}
                    options={employeeOptions}
                    placeholder="— Select owner —"
                  />
                </Field>

              </div>
            </div>
          </div>

          {/* ── RIGHT: Budget Details ── */}
          <div className={`${t.cardBg} ${t.cardShadow} rounded-2xl flex flex-col overflow-hidden min-h-0`}>
            <div className={`shrink-0 flex items-center justify-between px-5 py-3 border-b ${t.clientBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${t.clientMutedBg}`}>
                  <DollarSign className="w-3.5 h-3.5 text-red-500" />
                </div>
                <span className={`font-semibold text-sm ${t.textPrimary}`}>Budget Details</span>
              </div>
              <button type="button" onClick={toggle("includeInBuyingCenter")} className="flex items-center gap-2">
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
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {form.includeInBuyingCenter ? (
                <div className="grid grid-cols-2 gap-3">

                  <Field t={t} label="Buying Center" icon={ShoppingCart} span>
                    <SmartSelect
                      value={form.buyingCenter}
                      onChange={setVal("buyingCenter")}
                      options={buyingCtrOptions}
                      placeholder="— Select buying center —"
                    />
                  </Field>

                  <Field t={t} label="Financial Year" icon={Calendar} span>
                    <SmartSelect
                      value={form.financialYear}
                      onChange={setVal("financialYear")}
                      options={financialYrOptions}
                      placeholder="— Select year —"
                    />
                  </Field>

                  <Field t={t} label="Purchase Order Value ($)" icon={DollarSign} span>
                    <input type="text" inputMode="decimal" value={form.poValue} onChange={setField("poValue")}
                      className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                  </Field>

                  <Field t={t} label="Predicted Cost ($)" icon={DollarSign} span>
                    <input type="text" inputMode="decimal" value={form.predictedCost} onChange={setField("predictedCost")}
                      className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                  </Field>

                  <Field t={t} label="Outsourcing Cost ($)" icon={DollarSign} span>
                    <input type="text" inputMode="decimal" value={form.outsourcingCost} onChange={setField("outsourcingCost")}
                      className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                  </Field>

                </div>
              ) : (
                <div className={`h-full flex flex-col items-center justify-center gap-2 ${t.textMuted}`}>
                  <ShoppingCart className="w-8 h-8 opacity-30" />
                  <p className="text-xs text-center opacity-50">Check &quot;Include Buying Center&quot; to fill in budget details</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ── Action bar ── */}
        <div className="shrink-0 flex justify-between pt-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
