"use client";
import { useState } from "react";
import { formatToIST } from "../../lib/date";

/* ---------------- STATIC ODI ROWS ---------------- */
const ODI_ROWS = [
  { id: 1, jobName: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_TREND", key: "CM_INTERVAL_TREND" },
  { id: 2, jobName: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_SUM", key: "CM_INTERVAL_SUM" },
  { id: 3, jobName: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_COUNT", key: "CM_INTERVAL_COUNT" },
  { id: 4, jobName: "CRITICAL_EVENTS_LOAD", exec: "CM_CRITICAL_EVENTS_DAILY", key: "CM_CRITICAL_EVENTS_DAILY" },
  { id: 5, jobName: "CRITICAL_EVENTS_LOAD", exec: "CM_NON_CRITICAL_EVENTS_DAILY", key: "CM_NON_CRITICAL_EVENTS_DAILY" },
  { id: 6, jobName: "CRITICAL_EVENTS_LOAD", exec: "CM_OUTAGE_EVENTS_DAILY", key: "CM_OUTAGE_EVENTS_DAILY" },
  { id: 7, jobName: "MDM_METER_INSTLD_LOAD", exec: "S1_MDM_METER_INSTALLED", key: "S1_MDM_METER_INSTALLED" },
  { id: 8, jobName: "RCDC_DC_SUMMARY", exec: "MV1_RCDC_DC_SUMMARY", key: "MV1_RCDC_DC_SUMMARY" },
  { id: 9, jobName: "MV1_CONSUMER_MASTER", exec: "MV1_CONSUMER_MASTER", key: "MV1_CONSUMER_MASTER" },
  { id: 10, jobName: "FEEDER_DAILY_CONSUMPTION", exec: "B1_FDR_DLY_CONS", key: "B1_FDR_DLY_CONS" },
  { id: 11, jobName: "PKG_DT_DLY_CONSUMPTION_NEW", exec: "B1_DT_DAILY_CONSUMPTION", key: "B1_DT_DAILY_CONSUMPTION" },
  { id: 12, jobName: "PKG_SLA_LOAD", exec: "CM_DAILY_SLA_MDM", key: "CM_DAILY_SLA_MDM" },
  { id: 13, jobName: "PKG_SLA_LOAD", exec: "CM_MONTHLY_SLA_MDM", key: "CM_MONTHLY_SLA_MDM" },
  { id: 14, jobName: "PKG_SLA_LOAD", exec: "CM_INTERVAL_SLA_MDM", key: "CM_INTERVAL_SLA_MDM" },
  { id: 15, jobName: "DAILY_SLA_REFRESH", exec: "SLA_MV_DAY_PARAM", key: "SLA_MV_DAY_PARAM" },
  { id: 16, jobName: "RCDC_DETAILS", exec: "RCDCDETAILS", key: "RCDCDETAILS" },
  { id: 17, jobName: "PRC_LOAD_INTERVAL_SLA_MONITORING", exec: "INTERVAL_SLA_MONITORING", key: "INTERVAL_SLA_MONITORING" },
  { id: 18, jobName: "PREPAIDRECHARGE_TRANSACTIONS", exec: "PREPAIDRECHARGE_TRANSACTIONS", key: "PREPAIDRECHARGE_TRANSACTIONS" },
];

export default function OdiReport() {
  const [rows, setRows] = useState(
    ODI_ROWS.map(r => ({
      ...r,
      jobStatus: "NOT STARTED",
      lastUpdated: "-",
      tableStatus: "-",
      remarks: "",
      loading: false,
    }))
  );

  /* ---------------- VALIDATE SINGLE ROW ---------------- */
  const validateRow = async (idx) => {
    const updated = [...rows];
    updated[idx].loading = true;
    setRows(updated);

    try {
      const res = await fetch("/api/odi-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobKey: rows[idx].key }),
      });

      const data = await res.json();

      updated[idx].lastUpdated = data.lastUpdated
        ? formatToIST(data.lastUpdated)
        : "-";

      updated[idx].tableStatus = data.lastUpdated
        ? "UPDATED"
        : "NOT UPDATED";

    } catch (e) {
      updated[idx].tableStatus = "ERROR";
    }

    updated[idx].loading = false;
    setRows([...updated]);
  };

  /* ---------------- VALIDATE ALL ---------------- */
  const validateAll = async () => {
    rows.forEach((_, idx) => validateRow(idx));
  };

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold text-center text-[#133E7C]">
        ODI Report
      </h1>

      <div className="flex justify-end">
        <button
          onClick={validateAll}
          className="bg-[#133E7C] text-white px-4 py-2 rounded"
        >
          Validate All
        </button>
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto max-h-[550px]">
        <table className="min-w-[1600px] text-sm border-collapse">
          <thead className="bg-[#133E7C] text-white sticky top-0">
            <tr>
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">ODI Job Name</th>
              <th className="p-2 border">Internal Execution</th>
              <th className="p-2 border">Job Status</th>
              <th className="p-2 border">Last Updated Date</th>
              <th className="p-2 border">Current Date</th>
              <th className="p-2 border">Table Status</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Validate</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-2 border text-center">{r.id}</td>
                <td className="p-2 border">{r.jobName}</td>
                <td className="p-2 border">{r.exec}</td>

                <td className="p-2 border">
                  <select
                    className="border rounded px-2 py-1"
                    value={r.jobStatus}
                    onChange={(e) => {
                      const u = [...rows];
                      u[i].jobStatus = e.target.value;
                      setRows(u);
                    }}
                  >
                    <option>COMPLETED</option>
                    <option>RUNNING</option>
                    <option>FAILED</option>
                    <option>NOT STARTED</option>
                    <option>NOT RUNNING</option>
                  </select>
                </td>

                <td className="p-2 border">{r.lastUpdated}</td>
                <td className="p-2 border" suppressHydrationWarning>{formatToIST(new Date())}</td>
                <td className="p-2 border font-semibold">{r.tableStatus}</td>

                <td className="p-2 border">
                  <input
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Remarks"
                    value={r.remarks}
                    onChange={(e) => {
                      const u = [...rows];
                      u[i].remarks = e.target.value;
                      setRows(u);
                    }}
                  />
                </td>

                <td className="p-2 border">
                  <button
                    onClick={() => validateRow(i)}
                    disabled={r.loading}
                    className="bg-[#133E7C] text-white px-3 py-1 rounded flex items-center gap-2"
                  >
                    {r.loading && (
                      <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    Validate
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
