"use client";

import { useTheme } from "../../../../context/ThemeContext";
import StatusBadge from "@/app/components/StatusBadge";
import SeverityBadge from "@/app/components/SeverityBadge";

export default function TicketRow({ ticket }) {
  const { t, isDark } = useTheme();

  const border = isDark ? "border-white/10" : "border-gray-200";

  return (
    <tr className={`border-b ${border} hover:bg-gray-50 dark:hover:bg-white/5`}>

      <td className="px-6 py-4">{ticket.id}</td>

      <td className="px-6 py-4">{ticket.issueType}</td>

      <td className="px-6 py-4">{ticket.subIssueType}</td>

      <td className="px-6 py-4">{ticket.description}</td>

      <td className="px-6 py-4">
    <SeverityBadge severity={ticket.severity} />
</td>

<td className="px-6 py-4">
    <StatusBadge status={ticket.status} />
</td>

      <td className="px-6 py-4">{ticket.issueDate}</td>

    </tr>
  );
}