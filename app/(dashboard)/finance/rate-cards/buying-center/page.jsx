"use client";

import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import RateCardTabs from "../components/RateCardTabs";
import BuyingCenterTopBar from "./components/BuyingCenterTopBar";
import BuyingCenterTable from "./components/BuyingCenterTable";
import AddBuyingCenterModal from "./components/AddBuyingCenterModal";
import CloneRateCardModal from "./components/CloneRateCardModal";
import Pagination from "../../../../components/pagination";
import { usePagination } from "../../../../../hooks/usePagination";
import {
  fetchBuyingCenters,
  cloneBuyingCenterThunk,
} from "@/store/slices/financeRateCardBuyingCenterSlice";
import { format } from "date-fns";
import { exportFile } from "@/store/slices/exportSlice";

export default function BuyingCenterPage() {
  const dispatch = useDispatch();
  const { buyingCenters, loading, error, cloning, cloneError } = useSelector(
    (state) => state.financeRateCardBuyingCenter
  );

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [cloneName, setCloneName] = useState("");

  // Fetch once — skip if already loaded
  useEffect(() => {
    if (buyingCenters.length === 0) {
      dispatch(fetchBuyingCenters());
    }
  }, [dispatch, buyingCenters.length]);

  const filteredBuyingCenters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return buyingCenters;
    return buyingCenters.filter((item) =>
      (item.bName ?? "").toLowerCase().includes(q)
    );
  }, [buyingCenters, search]);

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
  } = usePagination({ data: filteredBuyingCenters, pageSize: 10 });

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  const handleClone = () => {
    if (!cloneName.trim() || !selectedCenter) return;
    const createdBy = Number(
      typeof window !== "undefined" ? sessionStorage.getItem("empId") : 0
    ) || 0;
    dispatch(
      cloneBuyingCenterThunk({
        orgBId: selectedCenter.bId,
        buyCenterName: cloneName.trim(),
        createdBy,
      })
    ).unwrap()
      .then(() => setShowCloneModal(false))
      .catch(() => {/* cloneError shown in modal */});
  };

  const handleExport = async (exportFormat) => {
  try {
    if (!exportFormat) return;

    const exportData = (filteredBuyingCenters || []).map((item) => ({
      buyingCenter:
        item.buying_CenterName ??
        item.buyingCenterName ??
        item.bName ??
        item.name ??
        "",

      description:
        item.description ??
        item.Description ??
        "",
    }));

    await dispatch(
      exportFile({
        fileName: `buying-center-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns: [
          {
            key: "buyingCenter",
            header: "Buying Center",
          },
          {
            key: "description",
            header: "Description",
          },
        ],
        data: exportData,
      })
    ).unwrap();
  } catch (error) {
    console.error("BUYING CENTER EXPORT ERROR:", error);
  }
};

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <RateCardTabs />

        <BuyingCenterTopBar
  search={search}
  setSearch={handleSearch}
  pageSize={pageSize}
  setPageSize={setPageSize}
  onAdd={() => setShowAddModal(true)}
  handleCopy={() => handleExport("copy")}
  handlePrint={() => handleExport("print")}
  handlePDF={() => handleExport("pdf")}
  handleCSV={() => handleExport("csv")}
/>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-400">Loading buying centers…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Table + Pagination */}
        {!loading && !error && (
          <>
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
          </>
        )}

        <AddBuyingCenterModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            // TODO: call POST API then dispatch(fetchBuyingCenters())
            console.log("Add buying center:", data);
            setShowAddModal(false);
          }}
        />

        <CloneRateCardModal
          open={showCloneModal}
          onClose={() => setShowCloneModal(false)}
          cloningName={selectedCenter?.bName ?? ""}
          cloneName={cloneName}
          setCloneName={setCloneName}
          onClone={handleClone}
          cloning={cloning}
          cloneError={cloneError}
        />

      </div>
    </div>
  );
}
