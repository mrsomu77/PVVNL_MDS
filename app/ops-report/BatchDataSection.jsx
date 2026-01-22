"use client";
import { useState } from "react";
import { formatToIST, getTodayRange } from "../../lib/date";
import DataTable from "../components/DataTable";

export default function BatchDataSection() {
  const defaults = getTodayRange();
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setFetched(true);

    const res = await fetch("/api/ops-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to }),
    });

    const data = await res.json();
    setRows(data.data || []);
    setLoading(false);
  };

  return (
    <div className="bg-white shadow p-4 rounded space-y-4">
      <h2 className="font-semibold text-[#133E7C]">Batch Data</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-semibold">From Date</label>
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">To Date</label>
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-[#133E7C] text-white px-6 py-2 rounded flex items-center gap-2"
        >
          {loading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Fetch Data
        </button>
      </div>

      {/* Table */}
      {fetched && !loading && (
        <div className="max-h-[450px] overflow-y-auto border rounded">
          <DataTable
            columns={[
              "Batch",
              "No",
              "Start",
              "End",
              "Threads",
              "Duration",
              "Records",
              "Batch Job Id",
              "RPS",
              "Bus Date",
              "Param",
            ]}
            rows={rows.map((r) => [
              r[0],
              r[1],
              formatToIST(r[4]),
              formatToIST(r[5]),
              r[7],
              r[8],
              r[6],
              r[9],
              Number(r[10]).toFixed(3),
              formatToIST(r[3]),
              r[11] || "-",
            ])}
            emptyText="No batch data"
          />
        </div>
      )}
    </div>
  );
}
