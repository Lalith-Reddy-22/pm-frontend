"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchEmployeeRateCard,
  updateEmployeeRateCard,
} from "@/store/slices/employeeSlice";

export default function EmployeeRateCardPage() {
  const router = useRouter();
  const params = useParams();

  const empId = params?.empId;

  const dispatch = useDispatch();

const {
  rateCard,
  rateCardLoading,
  rateCardError,
  rateCardUpdateLoading,
  rateCardUpdateError,
} = useSelector((state) => state.employee);

const [rateCards, setRateCards] = useState([]);

useEffect(() => {
  if (!empId) return;

  console.log("===== RATE CARD PAGE =====");
  console.log("Employee ID:", empId);

  dispatch(fetchEmployeeRateCard(Number(empId)));
}, [empId, dispatch]);

useEffect(() => {
  if (!rateCard?.buyingCenters) {
    return;
  }

  const mappedRateCards = rateCard.buyingCenters.map((item) => ({
    bid: item.buyingCenterId,
    name: item.buyingCenterName,
    value: item.employeeHours,
  }));

  setRateCards(mappedRateCards);
}, [rateCard]);

  const handleRateChange = (index, value) => {
    setRateCards((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              value: value,
            }
          : item
      )
    );
  };

  const handleUpdate = async () => {
  try {
    const buyingCenters = rateCards.map((item) => ({
      buyingCenterId: Number(item.bid),
      employeeHours: Number(item.value) || 0,
    }));

    console.log(
      "===== RATE CARD UPDATE PAYLOAD ====="
    );

    console.log({
      employeeId: Number(empId),
      buyingCenters,
    });

    const result = await dispatch(
      updateEmployeeRateCard({
        empId: Number(empId),
        buyingCenters,
      })
    ).unwrap();

    console.log(
      "RATE CARD UPDATED:",
      result
    );

    alert("Rate card updated successfully.");

    router.push(`/employee/${empId}`);
  } catch (error) {
    console.error(
      "RATE CARD UPDATE FAILED:",
      error
    );

    alert(
      typeof error === "string"
        ? error
        : "Failed to update rate card."
    );
  }
};

  return (
    <div className="min-h-screen bg-[#f7f7f9] p-6">
      <div className="mx-auto max-w-[1200px]">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              className="flex  items-center justify-center text-[#E12729]"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-[#E12729]">
                Employee Rate Card
              </h1>

              <p className="text-sm text-[#E12729]">
                Employee ID: {empId}
              </p>
            </div>

          </div>
        </div>

        {/* RATE CARD */}
        <div className="rounded-xl border bg-white shadow-sm">

          {/* TITLE */}
          <div className="border-b px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Buy Center List
            </h2>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="w-[15%] px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    BID
                  </th>

                  <th className="w-[50%] px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    BNAME
                  </th>

                  <th className="w-[35%] px-6 py-3 text-xs font-semibold uppercase text-gray-500">
                    EMP VALUE
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
  {rateCardLoading ? (
    <tr>
      <td
        colSpan={3}
        className="px-6 py-10 text-center text-sm text-gray-500"
      >
        Loading rate card...
      </td>
    </tr>
  ) : rateCardError ? (
    <tr>
      <td
        colSpan={3}
        className="px-6 py-10 text-center text-sm text-red-500"
      >
        {rateCardError}
      </td>
    </tr>
  ) : rateCards.length === 0 ? (
    <tr>
      <td
        colSpan={3}
        className="px-6 py-10 text-center text-sm text-gray-500"
      >
        No rate card data found.
      </td>
    </tr>
  ) : (
    rateCards.map((item, index) => (
      <tr
        key={item.bid}
        className="hover:bg-gray-50"
      >
        {/* BID */}
        <td className="px-6 py-2.5 text-gray-700">
          {item.bid}
        </td>

        {/* BNAME */}
        <td className="px-6 py-2.5 text-gray-800">
          {item.name}
        </td>

        {/* EMP VALUE */}
        <td className="px-6 py-2.5">
          <input
            type="number"
            value={item.value ?? ""}
            onChange={(e) =>
              handleRateChange(index, e.target.value)
            }
            className="w-[135px] rounded border border-gray-400 px-2 py-1 text-sm outline-none focus:border-primary"
          />
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>

          {/* FOOTER */}
          <div className="flex justify-start gap-3 border-t px-6 py-4">

            <button
  type="button"
  onClick={handleUpdate}
  disabled={rateCardLoading || rateCardUpdateLoading || rateCards.length === 0}
  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
>
  {rateCardUpdateLoading ? "Updating..." : "Update"}
</button>

          </div>

        </div>
      </div>
    </div>
  );
}