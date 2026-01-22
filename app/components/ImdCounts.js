"use client";

import { useState } from "react";
import { getTodayRange } from "../../lib/date";
import DataTable from "./DataTable";

export default function ImdCounts() {
  const defaults = getTodayRange();

  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);

  const [imdRows, setImdRows] = useState([]);
  const [imdLoading, setImdLoading] = useState(false);
  const [imdFetched, setImdFetched] = useState(false);

  const fetchIMD = async () => {
    setImdLoading(true);
    setImdFetched(true);

    try {
      const res = await fetch("/api/imd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });

      const data = await res.json();
      setImdRows(data.data || []);
    } catch (e) {
      console.error("IMD fetch error", e);
      setImdRows([]);
    } finally {
      setImdLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="font-semibold text-[#133E7C] mb-3">
        Fetch IMD Counts
      </h2>

      {/* Inputs */}
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
          onClick={fetchIMD}
          disabled={imdLoading}
        //   className="bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-60"
        className="bg-[#133E7C] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {imdLoading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {imdLoading ? "Loading..." : "Fetch Data"}
        </button>
      </div>

      {/* Result */}
      {imdFetched && (
        <div className="mt-4">
          {imdRows.length === 0 && !imdLoading && (
            <div className="text-center text-gray-500 py-6">
              No IMD data found
            </div>
          )}

          {imdRows.length > 0 && !imdLoading && (
            <DataTable
              columns={["BUS_OBJ_CD", "BO_STATUS_CD", "COUNT"]}
              rows={imdRows.map((r) => [r[0], r[1], r[2]])}
            />
          )}
        </div>
      )}
    </div>
  );
}
