"use client";

import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { TICKETS } from "./data";

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

  const [pageSize, setPageSize] = useState(50);

  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState(null);

  const [sortDirection, setSortDirection] = useState("asc");

  const [showCreateModal, setShowCreateModal] = useState(false);


  const columns =
    activeTab === "raise"
      ? RAISE_COLUMNS
      : TRACKER_COLUMNS;

  const heading =
    role === "Admin"
      ? "Tickets"
      : "Create Ticket For Computerware Issue";

  return (
    <div className="p-6">

      <div
        className={`overflow-hidden rounded-xl ${t.cardBg} ${t.cardShadow}`}
      >
        <div className="px-6 pt-6">
          <h2 className={`text-2xl font-semibold ${t.textPrimary}`}>
            {heading}
          </h2>
        </div>

        {/* Admin Tabs */}

        {role === "Admin" && (
          <TicketTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Filters */}

        <TicketFilters
          role={role}
          activeTab={activeTab}
        />

        {/* Toolbar */}

        <TicketToolbar
          role={role}
          activeTab={activeTab}
          search={search}
          setSearch={setSearch}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPage={setPage}
          onCreate={() => setShowCreateModal(true)}
        />

        {/* Table */}

        <TicketTable
          role={role}
          activeTab={activeTab}
          columns={columns}
          page={page}
          pageSize={pageSize}
          search={search}
          sortBy={sortBy}
          sortDirection={sortDirection}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
        />

        {/* Pagination */}

        <TicketPagination
          page={page}
          setPage={setPage}
          totalEntries={0}
          totalPages={1}
          pageSize={pageSize}
        />
       
       <CreateTicketModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      </div>
    </div>
  );
}