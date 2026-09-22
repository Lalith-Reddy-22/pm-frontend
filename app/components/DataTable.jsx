"use client";

import TableBody from "./TableBody";
import TicketTableHeader from "@/app/(dashboard)/it/tickets/components/TicketTableHeader";

export default function DataTable({
  columns,
  data,
  emptyMessage = "No data available",
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <TicketTableHeader
          columns={columns}
          sortBy={sortBy}
          sortDirection={sortDirection}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
        />

        <TableBody
          columns={columns}
          data={data}
          emptyMessage={emptyMessage}
        />
      </table>
    </div>
  );
}