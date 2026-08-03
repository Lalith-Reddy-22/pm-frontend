"use client";

import { useState } from "react";
import CostCards from "./components/CostCards";
import TaskForm from "./components/TaskForm";
import HoursAllocation from "./components/HoursAllocation";


export default function CreateTaskPage() {
const [showHours, setShowHours] = useState(false);
const [formData, setFormData] = useState({
  taskName: "",
  priority: "",
  client: "Stemline",
  project: "ME-5636 ELZONRIS_Dr erba video-Update",
  startDate: "",
  endDate: "",
  resource: "",
  status: "",
});

const handleAddHours = () => {
  console.log("Form Data:", formData);

  const requiredFields = [
    "taskName",
    "priority",
    "startDate",
    "endDate",
    "resource",
    "status",
  ];

  const emptyFields = requiredFields.filter(
    (field) =>
      !formData[field] ||
      formData[field].toString().trim() === ""
  );

  if (emptyFields.length > 0) {
    alert(`Missing fields: ${emptyFields.join(", ")}`);
    return;
  }

  setShowHours(true);
};

  return (
    <>
      <CostCards />
      <div className="px-4 sm:px-6">
  <TaskForm
    formData={formData}
    setFormData={setFormData}
  />
</div>

      <div className="mt-6 flex justify-center">
        <button
  onClick={handleAddHours}
  className="rounded-lg bg-[#E12729] px-3 py-2 text-white hover:bg-red-700 mb-4"
>
  {showHours ? "Hide Hours" : "Click to Add Hours"}
</button>
      </div>

      <div className="px-4 sm:px-6 mt-4">
  {showHours && <HoursAllocation />}
</div>
    </>
  );
}