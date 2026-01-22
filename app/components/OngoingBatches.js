"use client";

import { useState } from "react";
import { formatToIST } from "../../lib/date";
import DataTable from "./DataTable";

export default function OngoingBatches() {
  const [ongoingRows, setOngoingRows] = useState([]);
  const [ongoingLoading, setOngoingLoading] = useState(false);
  const [ongoingFetched, setOngoingFetched] = useState(false);

  const loadOngoing = async () => {
    setOngoingLoading(true);
    setOngoingFetched(true);

    try {
      const res = await fetch("/api/ongoing", { method: "POST" });
      const data = await res.json();
      setOngoingRows(data.data || []);
    } catch (e) {
      console.error("Ongoing fetch error", e);
      setOngoingRows([]);
    } finally {
      setOngoingLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="font-semibold text-[#133E7C] mb-3">
        Ongoing Batches
      </h2>

      <button
        onClick={loadOngoing}
        disabled={ongoingLoading}
        // className="bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-2 disabled:opacity-60"
        className="bg-[#133E7C] text-white px-4 py-2 rounded flex items-center gap-2"
      >
        {ongoingLoading && (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        Load Ongoing Batches
      </button>

      {ongoingFetched && !ongoingLoading && (
        <div className="mt-4 max-h-[350px] overflow-y-auto border rounded">
          <DataTable
            columns={[
              "Batch",
              "Status",
              "Start",
              "End",
              "Threads",
              "Duration",
              "Records",
              "RPS",
            ]}
            rows={ongoingRows.map((r) => [
              r[0],
              r[1],
              formatToIST(r[2]),
              formatToIST(r[3]),
              r[4],
              r[5],
              r[6],
              r[7],
            ])}
            emptyText="No ongoing batches"
          />
        </div>
      )}
    </div>
  );
}
