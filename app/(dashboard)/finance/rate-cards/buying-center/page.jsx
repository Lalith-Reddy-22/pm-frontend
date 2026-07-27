"use client";

import { useMemo, useState } from "react";

import RateCardTabs from "../components/RateCardTabs";
import BuyingCenterTopBar from "./components/BuyingCenterTopBar";
import BuyingCenterTable from "./components/BuyingCenterTable";
import AddBuyingCenterModal from "./components/AddBuyingCenterModal";
import CloneRateCardModal from "./components/CloneRateCardModal";
import Pagination from "../../../../components/pagination";
import { usePagination } from "../../../../../hooks/usePagination";

import { buyingCenters } from "./data";

export default function BuyingCenterPage() {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
const [selectedCenter, setSelectedCenter] = useState(null);
const [cloneName, setCloneName] = useState("");

  const filteredBuyingCenters = useMemo(() => {
    const q = search.toLowerCase();

    return buyingCenters.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [search]);

  const {
    paginatedData,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
    pageNumbers,
  } = usePagination({
    data: filteredBuyingCenters,
    pageSize: 10,
  });

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <RateCardTabs />

        <BuyingCenterTopBar
          search={search}
          setSearch={setSearch}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onAdd={() => setShowAddModal(true)}
        />

<BuyingCenterTable
  buyingCenters={paginatedData}
  onClone={(center) => {
    setSelectedCenter(center);
    setCloneName("");
    setShowCloneModal(true);
  }}
/>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          hasPrev={hasPrev}
          hasNext={hasNext}
          prevPage={prevPage}
          nextPage={nextPage}
          pageNumbers={pageNumbers}
          setPage={setPage}
        />

        <AddBuyingCenterModal
  open={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSave={(data) => {
    console.log(data);
    // TODO: Call your API here
  }}
/>

<CloneRateCardModal
  open={showCloneModal}
  onClose={() => setShowCloneModal(false)}
  cloningName={selectedCenter?.name || ""}
  cloneName={cloneName}
  setCloneName={setCloneName}
  onClone={() => {
    console.log("Clone:", cloneName);

    setShowCloneModal(false);
  }}
/>

      </div>
    </div>
  );
}