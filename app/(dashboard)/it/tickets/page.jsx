"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { api } from "@/lib/api";
import { format } from "date-fns";

import TicketTabs from "./components/TicketTabs";
import TicketFilters from "./components/TicketFilter";
import TicketToolbar from "./components/TicketToolbar";
import TicketTable from "./components/TicketTable";
import TicketPagination from "./components/TicketPagination";
import CreateTicketModal from "./components/CreateTicketModal";
import IssueDetailModal from "./components/IssueDetailModal";
import IssueLoggedDetailsModal from "./components/IssueLoggedDetailsModal";
import { useDispatch } from "react-redux";
import { exportFile } from "@/store/slices/exportSlice";

import {
  raiseColumns as RAISE_COLUMNS,
  trackerColumns as TRACKER_COLUMNS,
} from "./constants";

const PAGE_SIZE = 10;

function normaliseTicket(ticket) {
  const rawDesc = ticket.issue_Description ?? ticket.issue_description ?? ticket.issueDescription ?? "";

  // Collapse newlines and trim for table display
  const description = rawDesc
    ? rawDesc.replace(/[\r\n]+/g, " ").trim()
    : "—";

  return {
    id:           ticket.issue_Id    ?? ticket.issue_id    ?? "—",
    issueType:    ticket.issue_Type  ?? ticket.issue_type  ?? "—",
    subIssueType: ticket.subcategory ?? ticket.subCategory ?? "—",
    priority:     ticket.severity    ?? "—",
    description,
    descriptionFull: rawDesc || "—",
    status:       ticket.status_Text ?? ticket.status_text ?? ticket.status ?? "—",
    issueDate:    ticket.issue_Date  ?? ticket.issue_date  ?? "—",
    employee:      ticket.employee_Name ?? ticket.employee_name ?? "—",
    employeeEmail: ticket.emailId       ?? ticket.email_id      ?? "—",
  };
}

/** Build the pageNumbers array with ellipsis — same logic as usePagination */
function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = [];
  const left  = page - 1;
  const right = page + 1;
  pages.push(1);
  if (left > 2) pages.push("…");
  for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) pages.push(i);
  if (right < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

export default function TicketsPage() {
  const { t } = useTheme();
  const dispatch = useDispatch();

  // ── session ───────────────────────────────────────────────────────────────
  const [empId,   setEmpId]   = useState(null);
  const [empType, setEmpType] = useState(null);
  const [role,    setRole]    = useState("employee");

  useEffect(() => {
    const id   = sessionStorage.getItem("empId");
    const type = sessionStorage.getItem("userType");
    const r    = sessionStorage.getItem("role");
    setEmpId(id   ? Number(id)   : null);
    setEmpType(type ? Number(type) : null);
    // Always derive role from userType to avoid stale sessionStorage "role" key
    const roleMap = {
      "1": "admin",
      "2": "pm",
      "3": "employee",
      "4": "pm_employee",
      "5": "sys_admin",
      "6": "management_admin",
    };
    setRole((type && roleMap[type]) ? roleMap[type] : (r ?? "employee"));
  }, []);

  // ── tab ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("raise");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // clear all filters on tab switch
    setIssueTypeId("");
    setSeverityId("");
    setStatusId("");
    setSearch("");
    setDateRange({ from: undefined, to: undefined });
    setPage(1);
  };

  // ── filters ───────────────────────────────────────────────────────────────
  const [search,      setSearch]      = useState("");
  const [dateRange,   setDateRange]   = useState({ from: undefined, to: undefined });
  const [issueTypeId, setIssueTypeId] = useState("");
  const [severityId,  setSeverityId]  = useState("");
  const [statusId,    setStatusId]    = useState(""); // raise tab shows all statuses

  // ── sort ──────────────────────────────────────────────────────────────────
  const [sortBy,        setSortBy]        = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // ── pagination state ──────────────────────────────────────────────────────
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  // ── data ──────────────────────────────────────────────────────────────────
  const [tickets,    setTickets]    = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  // ── modal ─────────────────────────────────────────────────────────────────
  const [showCreateModal,       setShowCreateModal]       = useState(false);
  const [selectedTicket,        setSelectedTicket]        = useState(null); // raise tab detail
  const [selectedTrackerIssueId, setSelectedTrackerIssueId] = useState(null); // tracker tab logged details

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    if (!empId || !empType) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      empId:      String(empId),
      empType:    String(empType),
      pageNumber: String(page),
      pageSize:   String(pageSize),
    });

    if (search.trim())  params.append("searchText",  search.trim());
    if (issueTypeId)    params.append("issueTypeId", String(issueTypeId));
    if (severityId)     params.append("severityId",  String(severityId));
    if (statusId)       params.append("statusId",    String(statusId));
    if (dateRange.from) params.append("startDate",   format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange.to)   params.append("endDate",     format(dateRange.to,   "yyyy-MM-dd"));

    try {
      const endpoint = (activeTab === "tracker" || role === "sys_admin")
        ? `/api/v1/ticket/all-list?${params.toString()}`
        : `/api/v1/ticket/list?${params.toString()}`;
      const data = await api.get(endpoint);
      setTickets((data?.tickets ?? []).map(normaliseTicket));
      setTotalCount(data?.totalCount ?? 0);
    } catch (err) {
      setError(err.message ?? "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [empId, empType, role, activeTab, page, pageSize, search, issueTypeId, severityId, statusId, dateRange]);

  // =====================================================
// FULL DATA EXPORT
// =====================================================
const handleTicketExport = async (exportFormat = "csv") => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      empId: String(empId),
      empType: String(empType),
      pageNumber: "1",
      pageSize: "10000",
    });

    if (search.trim()) {
      params.append("searchText", search.trim());
    }

    if (issueTypeId) {
      params.append("issueTypeId", String(issueTypeId));
    }

    if (severityId) {
      params.append("severityId", String(severityId));
    }

    if (statusId) {
      params.append("statusId", String(statusId));
    }

    if (dateRange.from) {
      params.append(
        "startDate",
        format(dateRange.from, "yyyy-MM-dd")
      );
    }

    if (dateRange.to) {
      params.append(
        "endDate",
        format(dateRange.to, "yyyy-MM-dd")
      );
    }

    const endpoint =
      activeTab === "tracker" || role === "sys_admin"
        ? `/api/v1/ticket/all-list?${params.toString()}`
        : `/api/v1/ticket/list?${params.toString()}`;

    const data = await api.get(endpoint);

    const exportData = (data?.tickets ?? []).map(normaliseTicket);

    const columns = [
      { key: "id", header: "Issue ID" },
      { key: "issueType", header: "Issue Type" },
      { key: "subIssueType", header: "Sub Issue Type" },
      { key: "priority", header: "Severity" },
      { key: "descriptionFull", header: "Description" },
      { key: "status", header: "Status" },
      { key: "issueDate", header: "Issue Date" },
      { key: "employee", header: "Employee" },
      { key: "employeeEmail", header: "Employee Email" },
    ];

    // Dispatch your existing global export
    await dispatch(
      exportFile({
        fileName: `ticket-list-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns,
        data: exportData,
      })
    ).unwrap();

  } catch (error) {
    console.error("TICKET FULL EXPORT ERROR:", error);
  } finally {
    setLoading(false);
  }
};

// =====================================================
// SELECTED PAGES EXPORT
// =====================================================
const handleTicketSelectedPages = async (
  exportFormat,
  fromPage,
  toPage
) => {
  try {
    const allTickets = [];

    for (
      let pageNumber = fromPage;
      pageNumber <= toPage;
      pageNumber++
    ) {
      const params = new URLSearchParams({
        empId: String(empId),
        empType: String(empType),
        pageNumber: String(pageNumber),
        pageSize: String(pageSize),
      });

      if (search.trim()) {
        params.append("searchText", search.trim());
      }

      if (issueTypeId) {
        params.append("issueTypeId", String(issueTypeId));
      }

      if (severityId) {
        params.append("severityId", String(severityId));
      }

      if (statusId) {
        params.append("statusId", String(statusId));
      }

      if (dateRange.from) {
        params.append(
          "startDate",
          format(dateRange.from, "yyyy-MM-dd")
        );
      }

      if (dateRange.to) {
        params.append(
          "endDate",
          format(dateRange.to, "yyyy-MM-dd")
        );
      }

      const endpoint =
        activeTab === "tracker" || role === "sys_admin"
          ? `/api/v1/ticket/all-list?${params.toString()}`
          : `/api/v1/ticket/list?${params.toString()}`;

      const data = await api.get(endpoint);

      allTickets.push(...(data?.tickets ?? []));
    }

    const exportData = allTickets.map(normaliseTicket);

    const columns = [
      { key: "id", header: "Issue ID" },
      { key: "issueType", header: "Issue Type" },
      { key: "subIssueType", header: "Sub Issue Type" },
      { key: "priority", header: "Severity" },
      { key: "descriptionFull", header: "Description" },
      { key: "status", header: "Status" },
      { key: "issueDate", header: "Issue Date" },
      { key: "employee", header: "Employee" },
      { key: "employeeEmail", header: "Employee Email" },
    ];

    await dispatch(
      exportFile({
        fileName: `ticket-list-pages-${fromPage}-to-${toPage}-${format(
          new Date(),
          "yyyy-MM-dd-HHmmss"
        )}`,
        format: exportFormat,
        columns,
        data: exportData,
      })
    ).unwrap();

  } catch (error) {
    console.error(
      "TICKET SELECTED PAGE EXPORT ERROR:",
      error
    );
  }
};

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Reset to page 1 on filter change
  const resetPage = () => setPage(1);

  // ── pagination display props (no slicing — tickets is already one page) ───
  const totalPages  = Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex  = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex    = Math.min(page * pageSize, totalCount);
  const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);

  const paginationProps = {
    page,
    totalPages,
    totalItems:  totalCount,
    startIndex,
    endIndex,
    hasPrev:     page > 1,
    hasNext:     page < totalPages,
    prevPage:    () => setPage((p) => Math.max(1, p - 1)),
    nextPage:    () => setPage((p) => Math.min(totalPages, p + 1)),
    goToPage:    (n) => setPage(Math.max(1, Math.min(totalPages, n))),
    pageNumbers,
    paginatedData: tickets,
  };

  // Only role "admin" (user_Type 1) can see the Issue Tracker tab
  const isAdmin = role === "admin";

  // Build raise columns — Issue ID cell opens detail modal
  // sys_admin gets an extra "Employee Details" column to see who raised the issue
  const raiseColumns = useMemo(() => {
    const idCol = {
      ...RAISE_COLUMNS[0],
      render: (row) => (
        <button
          onClick={() => setSelectedTicket(row)}
          className="font-medium text-[#E12729] hover:underline cursor-pointer"
        >
          {row.id}
        </button>
      ),
    };

    const employeeDetailsCol = {
      header: "Employee Details",
      accessor: "employee",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-700">{row.employeeEmail}</span>
          <span className="text-sm text-gray-900 font-medium">{row.employee}</span>
        </div>
      ),
    };

    const rest = RAISE_COLUMNS.slice(1); // Issue Type, Sub Issue Type, Severity, Description, Status, Issue Date

    if (role === "sys_admin") {
      // Insert Employee Details after Severity (index 2 in rest)
      return [idCol, ...rest.slice(0, 3), employeeDetailsCol, ...rest.slice(3)];
    }

    return [idCol, ...rest];
  }, [role]);

  // Build tracker columns — Issue Type cell shows type (black) + #ID (red, clickable) below
  const trackerColumns = useMemo(() => [
    {
      ...TRACKER_COLUMNS[0],
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.issueType}</span>
          <button
            onClick={() => setSelectedTrackerIssueId(row.id)}
            className="text-left text-xs font-medium text-[#E12729] hover:underline cursor-pointer"
          >
            #{row.id}
          </button>
        </div>
      ),
    },
    ...TRACKER_COLUMNS.slice(1),
  ], []);

  const columns = activeTab === "tracker" ? trackerColumns : raiseColumns;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className={`overflow-visible rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>

        {isAdmin && (
          <TicketTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        )}


        <TicketFilters
          role={role}
          activeTab={activeTab}
          issueTypeId={issueTypeId}
          severityId={severityId}
          statusId={statusId}
          onIssueTypeChange={(val) => { setIssueTypeId(val); resetPage(); }}
          onSeverityChange={(val)  => { setSeverityId(val);  resetPage(); }}
          onStatusChange={(val)    => { setStatusId(val);    resetPage(); }}
        />

        <TicketToolbar
  role={role}
  activeTab={activeTab}
  search={search}
  setSearch={(val) => {
    setSearch(val);
    resetPage();
  }}
  dateRange={dateRange}
  setDateRange={(val) => {
    setDateRange(val);
    resetPage();
  }}
  pageSize={pageSize}
  setPageSize={(size) => {
    setPageSize(size);
    resetPage();
  }}
  setPage={setPage}
  onCreate={() => setShowCreateModal(true)}

  handleFullData={handleTicketExport}
  handleSelectedPages={handleTicketSelectedPages}
  totalPages={totalPages}
/>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {error && (
          <p className="px-6 py-4 text-sm text-red-500">{error}</p>
        )}

        <TicketTable
          role={role}
          activeTab={activeTab}
          columns={columns}
          rows={loading ? [] : tickets}
          sortBy={sortBy}
          sortDirection={sortDirection}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
        />

        <TicketPagination {...paginationProps} />
      </div>

      <CreateTicketModal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); fetchTickets(); }}
      />

      <IssueDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdated={() => { setSelectedTicket(null); fetchTickets(); }}
      />

      <IssueLoggedDetailsModal
        issueId={selectedTrackerIssueId}
        onClose={() => setSelectedTrackerIssueId(null)}
      />
    </div>
  );
}
