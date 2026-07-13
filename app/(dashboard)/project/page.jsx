"use client";

import { useMemo, useState } from "react";

import ProjectToolbar from "./components/ProjectToolbar";
import ProjectTable from "./components/ProjectTable";
import ProjectPagination from "./components/Projectpagination";
import AddProjectModal from "./components/AddProjectModal";
import ProjectGrid from "./components/ProjectGrid";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/usePagination";

// ─── Sample data (replace with your real API / context data) ─────────────────
const SAMPLE_PROJECTS = [
  { id: 1, status: "COMPLETED", name: "0737_AMI LATAM 3D Face Ageing Module", client: "Allergan", startDate: "03/07/23", endDate: "04/14/23", outsourceValue: "$0.00", totalPOValue: "$42,840.00", createDate: "03/10/23" },
  { id: 2, status: "ACTIVE", name: "0738_BioGen Neural Mapping Phase II", client: "BioGen", startDate: "04/01/23", endDate: "08/30/23", outsourceValue: "$12,000.00", totalPOValue: "$98,500.00", createDate: "03/28/23" },
  { id: 3, status: "INPROGRESS", name: "0739_Pfizer Global Skin Analysis Tool", client: "Pfizer", startDate: "05/15/23", endDate: "12/31/23", outsourceValue: "$5,000.00", totalPOValue: "$135,200.00", createDate: "04/12/23" },
  { id: 4, status: "PENDING", name: "0740_J&J Dermal Simulation Engine", client: "J&J", startDate: "06/01/23", endDate: "11/15/23", outsourceValue: "$0.00", totalPOValue: "$72,000.00", createDate: "05/03/23" },
  { id: 5, status: "HOLD", name: "0741_AstraZeneca Wound Healing AI", client: "AstraZeneca", startDate: "02/14/23", endDate: "07/31/23", outsourceValue: "$8,750.00", totalPOValue: "$60,000.00", createDate: "02/01/23" },
  { id: 6, status: "CANCELLED", name: "0742_Roche Digital Pathology Review", client: "Roche", startDate: "01/10/23", endDate: "03/10/23", outsourceValue: "$0.00", totalPOValue: "$15,000.00", createDate: "01/05/23" },
  { id: 7, status: "COMPLETED", name: "0743_Sanofi Patient Outcome Predictor", client: "Sanofi", startDate: "07/01/22", endDate: "12/31/22", outsourceValue: "$20,000.00", totalPOValue: "$110,000.00", createDate: "06/20/22" },
  { id: 8, status: "ACTIVE", name: "0744_Novartis Real-World Evidence Platform", client: "Novartis", startDate: "08/15/23", endDate: "02/28/24", outsourceValue: "$30,000.00", totalPOValue: "$250,000.00", createDate: "07/01/23" },
  { id: 9, status: "INPROGRESS", name: "0745_Lilly Metabolic Disorder Dashboard", client: "Eli Lilly", startDate: "09/01/23", endDate: "03/31/24", outsourceValue: "$4,000.00", totalPOValue: "$88,000.00", createDate: "08/10/23" },
  { id: 10, status: "PENDING", name: "0746_Abbott Genomics Reporting Suite", client: "Abbott", startDate: "10/01/23", endDate: "04/30/24", outsourceValue: "$0.00", totalPOValue: "$45,500.00", createDate: "09/14/23" },
  { id: 11, status: "COMPLETED", name: "0747_Medtronic Cardiac Risk Scorer", client: "Medtronic", startDate: "01/20/23", endDate: "06/20/23", outsourceValue: "$7,200.00", totalPOValue: "$92,000.00", createDate: "01/15/23" },
  { id: 12, status: "ACTIVE", name: "0748_Bayer Oncology Imaging Analysis", client: "Bayer", startDate: "11/01/23", endDate: "05/31/24", outsourceValue: "$15,000.00", totalPOValue: "$175,000.00", createDate: "10/18/23" },
  { id: 13, status: "INPROGRESS", name: "0749_GSK Respiratory AI Monitor", client: "GSK", startDate: "12/01/23", endDate: "06/30/24", outsourceValue: "$9,500.00", totalPOValue: "$130,000.00", createDate: "11/10/23" },
  { id: 14, status: "HOLD", name: "0750_Merck Vaccine Efficacy Tracker", client: "Merck", startDate: "03/01/23", endDate: "09/01/23", outsourceValue: "$2,000.00", totalPOValue: "$55,000.00", createDate: "02/20/23" },
  { id: 15, status: "PENDING", name: "0751_Boehringer CNS Drug Visualizer", client: "Boehringer", startDate: "07/15/23", endDate: "01/15/24", outsourceValue: "$0.00", totalPOValue: "$38,000.00", createDate: "06/30/23" },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("list");

  // Filter data client-side by search term
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SAMPLE_PROJECTS;
    return SAMPLE_PROJECTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.client && p.client.toLowerCase().includes(q))
    );
  }, [search]);

  // Pagination hook – single source of truth
  const pagination = usePagination({ data: filteredData, pageSize: 10 });

  return (
    <div className="space-y-4 p-4 sm:p-6">



      {/* Toolbar Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <ProjectToolbar
          search={search}
          setSearch={setSearch}
          pageSize={pagination.pageSize}
          setPageSize={pagination.setPageSize}
          setPage={pagination.setPage}
          view={view}
          setView={setView}
        />
      </div>

      {/* Table/Grid & Pagination Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Table or Grid */}
        {view === "list" ? (
          <ProjectTable rows={pagination.paginatedData} />
        ) : (
          <ProjectGrid />
        )}

        {/* Pagination – spread all hook returns */}
        <ProjectPagination {...pagination} />
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}