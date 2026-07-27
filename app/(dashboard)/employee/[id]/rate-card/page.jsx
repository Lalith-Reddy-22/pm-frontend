"use client";

import { useState } from "react";
import { employee, buyingCenters } from "./data";
import RateCardHeader from "./components/RateCardHeader";
import RateCardTable from "./components/RateCardTable";

export default function RateCardPage() {
  const [rateCardData, setRateCardData] = useState(buyingCenters);
  const [search, setSearch] = useState("");
  const handleSave = () => {
  console.log(rateCardData);
};

  return (
    <div className="space-y-6 p-6">
      <RateCardHeader employee={employee} />

      <RateCardTable
  data={rateCardData}
  setData={setRateCardData}
  onSave={handleSave}
/>

    </div>
  );
}