"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, FolderOpen, Save, DollarSign, Calendar,
  Globe, ShoppingCart, Hash, Tag, Users, Building2, AlignLeft,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import { getProjectLookups } from "@/services/financeClientService";
import axiosClient from "@/services/axiosClient";
import SmartSelect from "@/app/components/SmartSelect";

const STATUS_MAP   = { Active: 1, Inactive: 2, Completed: 3, "On Hold": 4 };
const BILLING_MAP  = { Billable: 1, "Non-Billable": 2, Internal: 3 };
const STATUS_OPTS  = ["Active", "Inactive", "Completed", "On Hold"].map((s) => ({ value: s, label: s }));
const BILLING_OPTS = ["Billable", "Non-Billable", "Internal"].map((s) => ({ value: s, label: s }));

// Stable — prevents focus loss on every keystroke
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

export default function AddProject() {
  const { t } = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({
    projectName:         "",
    region:              "",
    projectStatus:       "Active",
    clientId:            "",
    projectCode:         "",
    type:                "Billable",
    subClient:           "",
    startDate:           "",
    endDate:             "",
    projectOwner:        "",
    description:         "",
    includeBuyingCenter: false,
    buyingCenterId:      "",
    financialYearId:     "",
    purchaseOrderValue:  "",
    predictedCost:       "",
    outsourcingCost:     "",
  });

  const [clients, setClients]             = useState([]);
  const [managers, setManagers]           = useState([]);
  const [buyingCenters, setBuyingCenters] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState("");

  useEffect(() => {
    getProjectLookups()
      .then((data) => {
        setClients(data.clients ?? []);
        setManagers(data.projectManagers ?? []);
        setBuyingCenters(data.buyingCenters ?? []);
        setFinancialYears(data.financialYears ?? []);
      })
      .catch(() => {});
  }, []);

  const setField = (key) => (e)   => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const setVal   = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));
  const toggle   = (key) => ()    => setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  const goBack   = () => router.push("/finance/project-lists");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) { setError("Project Name is required.");      return; }
    if (!form.clientId)           { setError("Please select a Client.");         return; }
    if (!form.projectStatus)      { setError("Please select a Project Status."); return; }

    setError("");
    setSaving(true);
    const empId = typeof window !== "undefined" ? sessionStorage.getItem("empId") : null;

    try {
      const payload = {
        projectCode:           form.projectCode || null,
        clientId:              form.clientId      ? Number(form.clientId)      : null,
        projectTitle:          form.projectName,
        startDate:             form.startDate     || null,
        endDate:               form.endDate       || null,
        projectManagerIds:     form.projectOwner  || null,
        buyingCenterId:        form.buyingCenterId  ? Number(form.buyingCenterId)  : null,
        financialYearId:       form.financialYearId ? Number(form.financialYearId) : null,
        predictedValue:        Number(form.predictedCost)      || 0,
        outsourcingValue:      Number(form.outsourcingCost)    || 0,
        totalValue:            Number(form.purchaseOrderValue) || 0,
        projectStatus:         STATUS_MAP[form.projectStatus]  ?? 1,
        billingType:           BILLING_MAP[form.type]          ?? 1,
        region:                form.region      || null,
        subClientName:         form.subClient   || null,
        description:           form.description || null,
        includeInBuyingCenter: form.includeBuyingCenter,
        createdBy:             empId ? Number(empId) : 0,
      };

      await axiosClient.post("/finance-project", payload);
      router.push("/finance/project-lists");
    } catch (e) {
      const errData = e.response?.data;
      const msg =
        errData?.errors
          ? Object.entries(errData.errors).map(([k, v]) => `${k}: ${[v].flat().join(", ")}`).join(" | ")
          : errData?.title || errData?.detail || errData?.message || e.message || "Failed to create project.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const clientOptions      = clients.map((c) => ({ value: String(c.client_ID), label: c.client_Title }));
  const managerOptions     = managers.map((m) => ({ value: String(m.empId), label: m.employee_Name }));
  const buyingCtrOptions   = buyingCenters.map((bc) => ({ value: String(bc.bId), label: bc.bName }));
  const financialYrOptions = financialYears.map((y) => ({ value: String(y.id), label: y.financial_Year }));

  return (
    <div className={`${t.mainBg} h-full flex flex-col overflow-hidden`}>

      {/* ── Top bar ── */}
      <div className="shrink-0 px-6 pt-4 pb-3">
        <button onClick={goBack} className="flex items-center gap-1.5 text-sm mb-3 text-red-500 hover:text-red-600">
          <ArrowLeft className="w-4 h-4" /> Back to Project Lists
        </button>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${t.clientIconBg}`}>
            <FolderOpen className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className={`text-base font-bold ${t.textPrimary}`}>Add Project</h1>
            <p className={`text-xs ${t.textMuted} mt-0.5`}>Fill in the details to create a new project</p>
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
                  <input required value={form.projectName} onChange={setField("projectName")}
                    placeholder="Enter project name"
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Region" icon={Globe}>
                  <input value={form.region} onChange={setField("region")}
                    placeholder="Enter region"
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Project Status" icon={Tag}>
                  <SmartSelect
                    value={form.projectStatus}
                    onChange={setVal("projectStatus")}
                    options={STATUS_OPTS}
                    placeholder="Select status"
                  />
                </Field>

                <Field t={t} label="Client" icon={Building2}>
                  <SmartSelect
                    value={form.clientId}
                    onChange={setVal("clientId")}
                    options={clientOptions}
                    placeholder="— Select client —"
                  />
                </Field>

                <Field t={t} label="Project Code" icon={Hash}>
                  <input value={form.projectCode} onChange={setField("projectCode")}
                    placeholder="Enter project code"
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Type" icon={Tag}>
                  <SmartSelect
                    value={form.type}
                    onChange={setVal("type")}
                    options={BILLING_OPTS}
                    placeholder="Select type"
                  />
                </Field>

                <Field t={t} label="SubClient" icon={Building2}>
                  <input value={form.subClient} onChange={setField("subClient")}
                    placeholder="Enter sub client"
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
                    options={managerOptions}
                    placeholder="— Select owner —"
                  />
                </Field>

                <Field t={t} label="Description" icon={AlignLeft} span>
                  <textarea rows={3} value={form.description} onChange={setField("description")}
                    placeholder="Enter project description"
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText} resize-none`} />
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
              <button type="button" onClick={toggle("includeBuyingCenter")} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  form.includeBuyingCenter ? "bg-red-600 border-red-600" : `border-gray-400 ${t.clientInputBg}`
                }`}>
                  {form.includeBuyingCenter && (
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
              <div className="grid grid-cols-2 gap-3">

                <Field t={t} label="Buying Center" icon={ShoppingCart} span>
                  <SmartSelect
                    value={form.buyingCenterId}
                    onChange={setVal("buyingCenterId")}
                    options={buyingCtrOptions}
                    placeholder="— Select buying center —"
                  />
                </Field>

                <Field t={t} label="Financial Year" icon={Calendar} span>
                  <SmartSelect
                    value={form.financialYearId}
                    onChange={setVal("financialYearId")}
                    options={financialYrOptions}
                    placeholder="— Select year —"
                  />
                </Field>

                <Field t={t} label="Purchase Order Value ($)" icon={DollarSign} span>
                  <input type="text" inputMode="decimal" placeholder="0.00"
                    value={form.purchaseOrderValue} onChange={setField("purchaseOrderValue")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Predicted Cost ($)" icon={DollarSign} span>
                  <input type="text" inputMode="decimal" placeholder="0.00"
                    value={form.predictedCost} onChange={setField("predictedCost")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

                <Field t={t} label="Outsourcing Cost ($)" icon={DollarSign} span>
                  <input type="text" inputMode="decimal" placeholder="0.00"
                    value={form.outsourcingCost} onChange={setField("outsourcingCost")}
                    className={`flex-1 bg-transparent outline-none text-xs ${t.clientInputText}`} />
                </Field>

              </div>
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
            <Save className="w-4 h-4" /> {saving ? "Creating…" : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
