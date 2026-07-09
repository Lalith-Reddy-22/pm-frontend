"use client";

import { useTheme } from "../../context/ThemeContext";
import ClientTile from "../../components/ClientTile";

const CLIENTS = [
  "AbbVie", "Allergan", "Belkyra Quiz Module", "Berlin Chemie",
  "BGB", "Calcium", "Celltrion", "CSL Behring",
  "Defgfr", "ECIR", "Eli Lilly", "Exact",
  "Ferring", "Fresenius Kabi", "Geron", "Idorsia",
  "Internal", "Luminology", "Merck", "NHSc",
  "Novartis", "Pfizer", "Roche", "Sanofi",
];

export default function ClientsPage() {
  const { t } = useTheme();

  return (
    <div className="p-6">
      <h1 className={`text-xl font-bold mb-6 ${t.textPrimary}`}>Clients</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CLIENTS.map(name => (
          <ClientTile key={name} name={name} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
}
