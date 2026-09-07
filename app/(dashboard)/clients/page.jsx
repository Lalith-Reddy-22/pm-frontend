"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ClientTile from "../../components/ClientTile";
import axiosClient from "@/services/axiosClient";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
  const { t } = useTheme();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosClient.get("/client/all");

      console.log("CLIENT API RESPONSE:", response.data);

      setClients(response.data?.clients || []);
    } catch (error) {
      console.error(
        "CLIENT API ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load clients."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <p className={`text-sm ${t.textSecondary}`}>
            Loading clients...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {clients.map((client) => (
  <ClientTile
    key={client.client_Id}
    name={client.client_Title?.trim()}
    onClick={() => {
      router.push(`/clients/${client.client_Id}`);
    }}
  />
))}
      </div>

      {clients.length === 0 && (
        <div className="py-20 text-center">
          <p className={`text-sm ${t.textSecondary}`}>
            No clients found.
          </p>
        </div>
      )}
    </div>
  );
}