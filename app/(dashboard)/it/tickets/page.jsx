"use client";

import { useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { TICKETS } from "./data";
import { usePagination } from "@/hooks/usePagination";

import TicketTabs from "./components/TicketTabs";
import TicketFilters from "./components/TicketFilter";
import TicketToolbar from "./components/TicketToolbar";
import TicketTable from "./components/TicketTable";
import TicketPagination from "./components/TicketPagination";
import CreateTicketModal from "./components/CreateTicketModal";

import {
  raiseColumns as RAISE_COLUMNS,
  trackerColumns as TRACKER_COLUMNS,
} from "./constants";

export default function TicketsPage() {
  const { t } = useTheme();
  const role = "Admin";
  const [activeTab, setActiveTab] = useState("raise");

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  const [sortBy, setSortBy] = useState(null);

  const [sortDirection, setSortDirection] = useState("asc");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    const { from, to } = dateRange;
    const hasRange = from || to;

    return TICKETS.filter((ticket) => {
      if (q) {
        const value = [
          ticket.id,
          ticket.issueType,
          ticket.subIssueType,
          ticket.description,
          ticket.status,
        ]
          .filter(Boolean)
          .some((item) => String(item).toLowerCase().includes(q));

        if (!value) return false;
      }

      if (hasRange) {
        const ticketDate = new Date(ticket.createdAt || ticket.date || Date.now());
        const fromDate = from ?? new Date(0);
        const toDate = to ?? new Date(8640000000000000);
        if (ticketDate < fromDate || ticketDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }, [search, dateRange]);

  const pagination = usePagination({ data: filteredTickets, pageSize: 50 });


  const columns =
    activeTab === "raise"
      ? RAISE_COLUMNS
      : TRACKER_COLUMNS;

  const heading =
    role === "Admin"
      ? "Tickets"
      : "Create Ticket For Computerware Issue";

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className={`overflow-visible rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>
        <div className="px-6 pt-6">
          <h2 className={`text-2xl font-semibold ${t.textPrimary}`}>
            {heading}
          </h2>
        </div>

        {role === "Admin" && (
          <TicketTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        <TicketFilters
          role={role}
          activeTab={activeTab}
        />

        <TicketToolbar
          role={role}
          activeTab={activeTab}
          search={search}
          setSearch={setSearch}
          dateRange={dateRange}
          setDateRange={setDateRange}
          pageSize={pagination.pageSize}
          setPageSize={pagination.setPageSize}
          setPage={pagination.setPage}
          onCreate={() => setShowCreateModal(true)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <TicketTable
          role={role}
          activeTab={activeTab}
          columns={columns}
          rows={pagination.paginatedData}
          sortBy={sortBy}
          sortDirection={sortDirection}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
        />

        <TicketPagination {...pagination} />
      </div>

      <CreateTicketModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}