"use client";

import DataTable from "@/app/components/DataTable";
import { TICKETS } from "../data";

export default function TicketTable({
  columns,
  search = "",
  page = 1,
  pageSize = 50,
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
}) {
  const normalizedSearch = search.toLowerCase();
  const filteredTickets = TICKETS.filter((ticket) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      ticket.id,
      ticket.issueType,
      ticket.subIssueType,
      ticket.description,
      ticket.status,
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const startIndex = (page - 1) * pageSize;
  const pagedTickets = filteredTickets.slice(startIndex, startIndex + pageSize);

  return (
    <div className="overflow-x-auto [&_*]:border-0 [&_*]:border-b-0">
      <DataTable
        columns={columns}
        data={pagedTickets}
        emptyMessage="No tickets found"
        sortBy={sortBy}
        sortDirection={sortDirection}
        setSortBy={setSortBy}
        setSortDirection={setSortDirection}
      />
    </div>
  );
}