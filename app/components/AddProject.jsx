"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import DatePicker from "./DatePicker";
import CustomSelect from "@/components/ui/CustomSelect";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "@/store/slices/clientSlice";
import { fetchFinancialYears } from "@/store/slices/financialYearSlice";
import { fetchBuyingCenters } from "@/store/slices/buyingCenterSlice";

export default function AddProject({
  isEditMode,
  projectId,
  projectDetails,
  projectDetailsLoading,
  projectDetailsError,
}) {

  const dispatch = useDispatch();

const {
  clients,
  loading: clientsLoading,
  error: clientsError,
} = useSelector((state) => state.client);

const {
  financialYears,
  loading: financialYearsLoading,
  error: financialYearsError,
} = useSelector((state) => state.financialYear);

const {
  buyingCenters,
  loading: buyingCentersLoading,
  error: buyingCentersError,
} = useSelector((state) => state.buyingCenter);

console.log("FINANCIAL YEARS FROM REDUX:", financialYears);

useEffect(() => {
  dispatch(fetchClients());
  dispatch(fetchFinancialYears());
  dispatch(fetchBuyingCenters());
}, [dispatch]);

  const router = useRouter();

  const [formData, setFormData] = useState({
    projectName: "",
    region: "",
    projectStatus: "",
    client: "",
    projectCode: "",
    type: "",
    subClient: "",
    startDate: "",
    endDate: "",
    projectOwner: "",

    includeBuyingCenter: true,
    buyingCenter: "",
    financialYear: "",
    purchaseOrderValue: "",
    predictedCost: "",
    outsourcingCost: "",
  });

  const PROJECT_STATUS_OPTIONS = [
  {
    value: "",
    label: "Select Status",
  },
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "On Hold",
    label: "On Hold",
  },
];

const clientOptions = [
  {
    value: "",
    label: "Select Client",
  },

  ...clients.map((client) => ({
    value: String(client.client_Id),
    label: client.client_Title,
  })),
];

const BUYING_CENTER_OPTIONS = [
  {
    value: "",
    label: "Select Buying Center",
  },

  ...buyingCenters.map((item) => ({
    value: String(item.bId),
    label: item.bName,
  })),
];

const financialYearOptions = [
  {
    value: "",
    label: "Select Financial Year",
  },
  ...financialYears.map((year) => ({
    value: String(year.id),
    label: year.financial_Year,
  })),
];


const TYPE_OPTIONS = [
  {
    value: "",
    label: "Select Type",
  },
   {
    value: "billable",
    label: "Billable",
  },
  {
    value: "nonbillable",
    label: "Non-Billable",
  },
];

const PROJECT_OWNER_OPTIONS = [
  { value: "7", label: "Suresh Waghmore" },
  { value: "10", label: "Shijin Pulikkotil" },
  { value: "11", label: "Hari Prabhakaran" },
  { value: "13", label: "Sunil Kadhamba" },
  { value: "22", label: "Binoj" },
  { value: "52", label: "Pavithra G" },
  { value: "71", label: "Rajesh Hariharan" },
  { value: "78", label: "Vishwanath BJ" },
  { value: "21", label: "Sonali Sulakhe" },
  { value: "45", label: "Shuja Jacob" },
  { value: "60", label: "Karishma Reji" },
  { value: "67", label: "Jigar Gohel" },
  { value: "104", label: "Rosmin Thomas" },
  { value: "110", label: "Pavitha Admin" },
  { value: "115", label: "Aditi Dash" },
  { value: "117", label: "Prajwal P Kunte" },
  { value: "128", label: "Akshay Mohan" },
  { value: "140", label: "Shruti Appaji" },
  { value: "129", label: "Bhuvinaya Sriramkumar" },
  { value: "136", label: "Rishabh Pandey" },
  { value: "168", label: "Rajesh Balasundara" },
  { value: "170", label: "Michelle Trussel" },
  { value: "1174", label: "Sristi Das" },
  { value: "1180", label: "Shreya Nagaraj" },
  { value: "1181", label: "Akshaya K" },
  { value: "1183", label: "Jaclyn Pallotti" },
  { value: "171", label: "Shilpa Mistry" },
];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const parseDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  return date;
};

useEffect(() => {
  if (!isEditMode || !projectDetails) {
    return;
  }

  const buyingCenterId = Number(projectDetails.b_Id);

  const projectType =
    buyingCenterId === 0 || buyingCenterId === 25
      ? "nonbillable"
      : "billable";

  console.log("========== EDIT PROJECT ==========");
  console.log("PROJECT ID:", projectDetails.project_Id);
  console.log("B_ID:", projectDetails.b_Id);
  console.log("BUYING CENTER ID:", buyingCenterId);
  console.log("CALCULATED TYPE:", projectType);
  console.log("CLIENT ID:", projectDetails.client_Id);
  console.log("CLIENT NAME:", projectDetails.client_Title);
  console.log("FINANCIAL YEAR ID:", projectDetails.financial_Year_Id);
  console.log("=================================");

  setFormData((prev) => ({
    ...prev,

    projectName: projectDetails.project_Title || "",

    region: "",

    projectStatus: projectDetails.project_Status_Text || "",

    client: projectDetails.client_Id
      ? String(projectDetails.client_Id)
      : "",

    projectCode: projectDetails.projectCode || "",

    // B_Id 0 and 25 = Non-Billable
    type: projectType,

    // Sub Client = selected Client
    subClient: projectDetails.client_Title || "",

    startDate: parseDate(projectDetails.startDate),
    endDate: parseDate(projectDetails.endDate),

    projectOwner: projectDetails.projectOwner || "",

    includeBuyingCenter: true,

    buyingCenter: projectDetails.b_Id
  ? String(projectDetails.b_Id)
  : "",

    financialYear: projectDetails.financial_Year_Id
      ? String(projectDetails.financial_Year_Id)
      : "",

    purchaseOrderValue: projectDetails.totalValue ?? "",

    predictedCost: projectDetails.predicted_Value ?? "",

    outsourcingCost: projectDetails.outsourcing_Value ?? "",
  }));
}, [isEditMode, projectDetails]);

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[#E12729] cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>

        </div>

      </div>

      {/* Main Layout */}

      <div className="grid grid-cols-12 gap-6">

        {/* Left Section */}

        <div className="col-span-12 xl:col-span-8">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Project Information
            </h2>

            <div className="grid grid-cols-2 gap-5">

              {/* Project Name */}

              <div className="col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Name
                </label>

                <input
                  value={formData.projectName}
                  onChange={(e) =>
                    handleChange("projectName", e.target.value)
                  }
                  placeholder="Enter Project Name"
                  className="h-8 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              {/* Region */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Region
                </label>

                <input
                  value={formData.region}
                  onChange={(e) =>
                    handleChange("region", e.target.value)
                  }
                  placeholder="Enter Region"
                  className="h-8 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Status
                </label>

                <CustomSelect
  value={formData.projectStatus}
  onChange={(value) =>
    handleChange("projectStatus", value)
  }
  placeholder="Select Status"
  options={PROJECT_STATUS_OPTIONS}
/>

              </div>

              {/* Client */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Client
                </label>

                <CustomSelect
  label="Client"
  options={clientOptions}
  value={formData.client}
  onChange={(value) => {
    const selectedClient = clients.find(
      (client) =>
        String(client.client_Id) === String(value)
    );

    setFormData((prev) => ({
      ...prev,
      client: value,
      subClient: selectedClient?.client_Title || "",
    }));
  }}
/>

              </div>

              {/* Project Code */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Code
                </label>

                <input
                  value={formData.projectCode}
                  onChange={(e) =>
                    handleChange("projectCode", e.target.value)
                  }
                  placeholder="Enter Project Code"
                  className="h-8 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-red-500"
                />

              </div>

              {/* Type */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type
                </label>

                <CustomSelect
  value={formData.type}
  onChange={(value) =>
    handleChange("type", value)
  }
  placeholder="Select Type"
  options={TYPE_OPTIONS}
/>

              </div>

              {/* Sub Client */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Sub Client
                </label>

                <input
  type="text"
  value={formData.subClient}
  onChange={(e) =>
    handleChange("subClient", e.target.value)
  }
  placeholder="Enter Sub Client"
  className="h-8 w-full rounded-md border border-gray-300 px-4 outline-none focus:border-red-500"
/>

              </div>

              {/* Start Date */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Start Date
                </label>

                <DatePicker
                  value={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={(date) => handleChange("startDate", date)}
                  placeholder="Select Start Date"
                />

              </div>

              {/* End Date */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </label>

                <DatePicker
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={(date) => handleChange("endDate", date)}
                  placeholder="Select End Date"
                />

              </div>

              {/* Project Owner */}

              <div className="col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project Owner
                </label>

                <CustomSelect
  value={formData.projectOwner}
  onChange={(value) => handleChange("projectOwner", value)}
  placeholder="Select Project Owner"
  options={PROJECT_OWNER_OPTIONS}
/>

              </div>

              <div className="flex items-center justify-start gap-3">

            <button
              type="button"
              onClick={() => {
                if (!formData.projectName.trim()) {
                  alert("Project Name is required");
                  return;
                }

                if (!formData.client) {
                  alert("Please select Client");
                  return;
                }

                if (!formData.projectStatus) {
                  alert("Please select Project Status");
                  return;
                }

                console.log("Create Project", formData);

                // TODO:
                // await axios.post("/api/projects", formData);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#E12729] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
  {isEditMode ? "Update Project" : "Create Project"}
            </button>

          </div>

            </div>

          </div>

        </div>

                {/* Right Section */}

        <div className="col-span-12 xl:col-span-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm top-6">

  {/* Include Buying Center */}

  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">

    <input
      type="checkbox"
      checked={formData.includeBuyingCenter}
      onChange={(e) =>
        handleChange("includeBuyingCenter", e.target.checked)
      }
      className="h-5 w-5 accent-red-600"
    />

    <span className="text-sm font-medium text-gray-700">
      Include Buying Center
    </span>

  </div>

  {/* Budget Details Heading */}

  <h2 className="mt-5 mb-6 text-xl font-semibold text-gray-800">
    Budget Details
  </h2>

  {/* Show only when Include Buying Center is checked */}

  {formData.includeBuyingCenter && (

    <div className="space-y-5">

      {/* Buying Center */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Buying Center
        </label>

        <CustomSelect
  value={formData.buyingCenter}
  onChange={(value) => handleChange("buyingCenter", value)}
  placeholder="Select Buying Center"
  options={BUYING_CENTER_OPTIONS}
/>

      </div>

      {/* Financial Year */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Financial Year
        </label>

        <CustomSelect
  label="Financial Year"
  options={financialYearOptions}
  value={formData.financialYear}
  onChange={(value) => {
    setFormData((prev) => ({
      ...prev,
      financialYear: value,
    }));
  }}
/>

      </div>

      {/* Purchase Order */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Purchase Order Value
        </label>

        <input
          type="number"
          placeholder="0.00"
          value={formData.purchaseOrderValue}
          onChange={(e) =>
            handleChange("purchaseOrderValue", e.target.value)
          }
          className="h-8 w-full rounded-md border border-gray-300 px-4 outline-none transition focus:border-red-500"
        />

      </div>

      {/* Predicted Cost */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Predicted Cost
        </label>

        <input
          type="number"
          placeholder="0.00"
          value={formData.predictedCost}
          onChange={(e) =>
            handleChange("predictedCost", e.target.value)
          }
          className="h-8 w-full rounded-md border border-gray-300 px-4 outline-none transition focus:border-red-500"
        />

      </div>

      {/* Outsourcing Cost */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Outsourcing Cost
        </label>

        <input
          type="number"
          placeholder="0.00"
          value={formData.outsourcingCost}
          onChange={(e) =>
            handleChange("outsourcingCost", e.target.value)
          }
          className="h-8 w-full rounded-md border border-gray-300 px-4 outline-none transition focus:border-red-500"
        />

      </div>

    </div>

  )}

</div>

        </div>

      </div>

    </div>
  );
}