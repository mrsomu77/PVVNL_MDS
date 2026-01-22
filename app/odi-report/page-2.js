"use client";

import { useState } from "react";
import { formatToIST } from "../../lib/date";

// const STATIC_ROWS = [
//   { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_TREND" },
//   { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_SUM" },
//   { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_COUNT" },
//   { job: "CRITICAL_EVENTS_LOAD", exec: "CM_CRITICAL_EVENTS_DAILY" },
//   { job: "MDM_METER_INSTLD_LOAD", exec: "S1_MDM_METER_INSTALLED" },
//   { job: "RCDC_DC_SUMMARY", exec: "MV1_RCDC_DC_SUMMARY" },
//   { job: "MV1_CONSUMER_MASTER", exec: "MV1_CONSUMER_MASTER" },
//   { job: "PREPAIDRECHARGE_TRANSACTIONS", exec: "PREPAIDRECHARGE_TRANSACTIONS" },
// ];

import { ODI_EXECUTIONS } from "./odiConfig";

export default function OdiReport() {
//   const [rows, setRows] = useState(
//     STATIC_ROWS.map((r) => ({
//       ...r,
//       status: "NOT STARTED",
//       lastUpdated: null,
//       tableStatus: "-",
//       loading: false,
//     }))
//   );
const [rows, setRows] = useState(
  ODI_EXECUTIONS.map((r) => ({
    ...r,
    status: "NOT STARTED",
    lastUpdated: null,
    tableStatus: "-",
    loading: false,
  }))
);

  const validate = async (idx, exec) => {
    setRows((p) =>
      p.map((r, i) => (i === idx ? { ...r, loading: true } : r))
    );

    const res = await fetch("/api/odi/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ execution: exec }),
    });

    const data = await res.json();

    setRows((p) =>
      p.map((r, i) =>
        i === idx
          ? {
              ...r,
              lastUpdated: data.lastUpdated,
              tableStatus: data.tableStatus,
              loading: false,
            }
          : r
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center text-[#133E7C] mb-6">
        ODI Report
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm border">
          <thead className="bg-[#133E7C] text-white">
            <tr>
              <th>S.No</th>
              <th>ODI Job Name</th>
              <th>Internal Execution</th>
              <th>Job Status</th>
              <th>Last Updated</th>
              <th>Table Status</th>
              <th>Validate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border">
                <td>{i + 1}</td>
                <td>{r.job}</td>
                <td>{r.exec}</td>
                <td>{r.status}</td>
                <td>{formatToIST(r.lastUpdated)}</td>
                <td className={r.tableStatus === "UPDATED" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {r.tableStatus}
                </td>
                <td>
                  <button
                    onClick={() => validate(i, r.exec)}
                    className="bg-[#133E7C] text-white px-3 py-1 rounded"
                    disabled={r.loading}
                  >
                    {r.loading ? "..." : "Validate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
