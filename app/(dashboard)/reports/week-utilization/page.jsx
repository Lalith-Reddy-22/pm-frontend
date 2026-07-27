import Header from "./components/Header";
import FilterSection from "./components/FilterSection";
import SectionTitle from "./components/SectionTitle";
import SummaryTable from "./components/SummaryTable";
import DesignationTable from "./components/DesignationTable";
import ClientTable from "./components/ClientTable";
import {designationBillable, designationNonBillable , clientData} from "./data";

export default function WeekUtilization() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] p-4 sm:p-6">
      <div className="mx-auto max-w-[1600px] rounded-lg border bg-white shadow-md p-6">

        <Header />

        <FilterSection />

        <SectionTitle title="Utilization Summary Team Wise" />

        <div className="grid grid-cols-2 gap-4 mt-3">
          <SummaryTable title="BILLABLE" />
          <SummaryTable title="NON BILLABLE" />
        </div>

      <SectionTitle title="Utilization Summary Designation Wise" />

      <div className="grid grid-cols-2 gap-4 mt-3">
            <DesignationTable
                title="BILLABLE"
                data={designationBillable}
            />
            <DesignationTable
                title="NON BILLABLE"
                data={designationNonBillable}
            />
        </div>

        <SectionTitle title="Utilization Summary Client Wise" />

        <div className="mt-3">
            <ClientTable data={clientData} />
        </div>
      </div>
    </div>
  );
}