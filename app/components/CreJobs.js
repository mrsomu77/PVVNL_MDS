// app/components/CreJobs.js
"use client";

import { useEffect, useState } from "react";
import { formatToIST } from "../../lib/date";

const BATCH_LABELS = {
  'D1-CREDW': "Activity Wait Periodic Monitor",
  'D1-CRERR': "Command Error Retry",
  'CM-CRERR': "Command Error COM IN PROG",
};

const Batch_Frequency = {
  'D1-CREDW': "Every 10 Minutes",
  'D1-CRERR': "Every 15 Minutes",
  'CM-CRERR': "Every 1 Hour",
};

function mapRunStatus(code) {
  if (code == 20) {
    return {
      text: "Running",
      badge: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    };
  }
  if (code == 40) {
    return {
      text: "Completed Successfully",
      badge: "bg-green-200 text-green-800 border border-green-300",
    };
  }
  if (code == 30) {
    return {
      text: "Getting Started",
      badge: "bg-green-50 text-green-800 border border-green-300",
    };
  }
  return {
    text: "Failed / Unknown",
    badge: "bg-red-100 text-red-800 border border-red-300",
  };
}

export default function CreBatches() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cre-status", { method: "POST" });
      const data = await res.json();
      setRows(data.data || []);
    } catch (e) {
      console.error("Cre fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 15000000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-[#133E7C]">
          Scheduled Batches Status
        </h2>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="bg-[#133E7C] text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Refresh
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rows.map((r) => {
          const status = mapRunStatus(r.runStatus);

          return (
            <div
              key={r.batch}
              className="border border-gray-200 rounded shadow-sm p-4 bg-white"
            >
              {/* Top row */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  {/* <div className="text-xs text-gray-500">HES</div> */}
                  <div className="font-semibold text-[#133E7C]">
                    {BATCH_LABELS[r.batch] || r.batch}
                  </div>
                </div>

                <div
                  className={`px-2 py-1 text-xs font-medium rounded ${status.badge}`}
                >
                  {status.text}
                </div>
              </div>

              {/* Batch */}
              <div className="mb-2">
                <div className="text-xs text-gray-500">Batch</div>
                <div className="text-sm font-medium">{r.batch}</div>
              </div>

              {/* Frequency */}
              <div className="mb-2">
                <div className="text-xs text-gray-500">Frequency</div>
                <div className="text-sm font-medium">
                    {Batch_Frequency[r.batch] || 'NA'}
                </div>
              </div>

              {/* Start / End */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-xs text-gray-500">Start</div>
                  <div className="text-sm">
                    {r.start ? formatToIST(r.start) : "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">End</div>
                  <div className="text-sm">
                    {r.end ? formatToIST(r.end) : "-"}
                  </div>
                </div>
              </div>

              {/* Threads / Records */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-xs text-gray-500">Threads</div>
                  <div className="text-sm">{r.threads ?? "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Records</div>
                  <div className="text-sm">{r.records ?? "-"}</div>
                </div>
              </div>

              {/* Duration / RPS */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-500">Duration (sec)</div>
                  <div className="text-sm">{r.duration ?? "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">RPS</div>
                  <div className="text-sm">
                    {r.rps !== null && r.rps !== undefined
                      ? Number(r.rps).toFixed(2)
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {rows.length === 0 && !loading && (
          <div className="col-span-full text-center text-gray-500 py-6">
            No Cre batch data found
          </div>
        )}
      </div>
    </div>
  );
}
