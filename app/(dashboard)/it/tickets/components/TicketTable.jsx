"use client";

import DataTable from "@/app/components/DataTable";

export default function TicketTable({
  columns,
  rows = [],
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
}) {
  return (
    <div className="overflow-x-auto">
      <DataTable
        columns={columns}
        data={rows}
        emptyMessage="No tickets found"
        sortBy={sortBy}
        sortDirection={sortDirection}
        setSortBy={setSortBy}
        setSortDirection={setSortDirection}
      />
    </div>
  );
}
