"use client";

import { useEffect, useState } from "react";
import { formatToIST } from "../../lib/date";

/* ------------------ STATIC ODI JOB DEFINITIONS ------------------ */
const ODI_ROWS = [
  { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_TREND" },
  { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_SUM" },
  { job: "CONSUMPTION_BATCH", exec: "CM_INTERVAL_COUNT" },
  { job: "CONSUMPTION_BATCH", exec: "CM_DAILY_MISSING_SUM" },
  { job: "CONSUMPTION_BATCH", exec: "CM_PEAK_OFFPEAK" },
  { job: "CONSUMPTION_BATCH", exec: "CM_ZERO_CONSUMPTION" },
  { job: "CONSUMPTION_BATCH", exec: "HOURLY_CONSUMPTION_DETAILS" },
  { job: "CONSUMPTION_BATCH", exec: "MONTHLY_CONSUMPTION_IMPORT" },
  { job: "CONSUMPTION_BATCH", exec: "MONTHLY_CONSUMPTION_VARIATION_2" },
  { job: "CONSUMPTION_BATCH", exec: "CM_REPORT_DN_ANALYSIS" },
  { job: "CONSUMPTION_BATCH", exec: "CM_REPORT_VA_ANALYSIS" },
  { job: "CONSUMPTION_BATCH", exec: "CM_NET_CONSUMPTION_DAILY" },
  { job: "CONSUMPTION_BATCH", exec: "METER_INSTALLATION_DAILY" },
  { job: "CONSUMPTION_BATCH", exec: "S1_MDM_METER_INSTALLED" },

  { job: "CRITICAL_EVENTS_LOAD", exec: "CM_CRITICAL_EVENTS_DAILY" },
  { job: "CRITICAL_EVENTS_LOAD", exec: "CM_NON_CRITICAL_EVENTS_DAILY" },
  { job: "CRITICAL_EVENTS_LOAD", exec: "CM_OUTAGE_EVENTS_DAILY" },

  { job: "MDM_METER_INSTLD_LOAD", exec: "S1_MDM_METER_INSTALLED" },
  { job: "RCDC_DC_SUMMARY", exec: "MV1_RCDC_DC_SUMMARY" },
  { job: "MV1_CONSUMER_MASTER", exec: "MV1_CONSUMER_MASTER" },
  { job: "FEEDER_DAILY_CONSUMPTION", exec: "B1_FDR_DLY_CONS" },
  { job: "PKG_DT_DLY_CONSUMPTION_NEW", exec: "B1_DT_DAILY_CONSUMPTION" },

  { job: "PKG_SLA_LOAD", exec: "CM_DAILY_SLA_MDM" },
  { job: "PKG_SLA_LOAD", exec: "CM_MONTHLY_SLA_MDM" },
  { job: "PKG_SLA_LOAD", exec: "CM_INTERVAL_SLA_MDM" },

  { job: "DAILY_SLA_REFRESH", exec: "SLA_MV_DAY_PARAM" },
  { job: "RCDC_DETAILS", exec: "RCDCDETAILS" },
  { job: "PRC_LOAD_INTERVAL_SLA_MONITORING", exec: "INTERVAL_SLA_MONITORING" },
  { job: "PREPAIDRECHARGE_TRANSACTIONS", exec: "PREPAIDRECHARGE_TRANSACTIONS" },
];

export default function OdiReport() {
  const [rows, setRows] = useState([]);
  const [today, setToday] = useState("");
  const [validateAllLoading, setValidateAllLoading] = useState(false);

  /* ------------------ INIT STATIC ROWS ------------------ */
  useEffect(() => {
    const t = new Date();
    const todayStr = t.toLocaleDateString("en-IN");
    setToday(todayStr);

    setRows(
      ODI_ROWS.map((r, i) => ({
        id: i,
        job: r.job,
        exec: r.exec,
        jobStatus: "NOT STARTED",
        lastUpdated: "",
        tableStatus: "NOT UPDATED",
        remarks: "",
        loading: false,
      }))
    );
  }, []);

  /* ------------------ SINGLE VALIDATE ------------------ */
  const validateRow = async (rowIndex) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === rowIndex ? { ...r, loading: true } : r
      )
    );

    try {
      const res = await fetch("/api/odi/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ execution: rows[rowIndex].exec }),
      });

      const data = await res.json();

      setRows((prev) =>
        prev.map((r, i) =>
          i === rowIndex
            ? {
                ...r,
                lastUpdated: data.lastUpdated
                  ? formatToIST(data.lastUpdated)
                  : "-",
                tableStatus: data.updated ? "UPDATED" : "NOT UPDATED",
                remarks: data.updated
                  ? "Validated successfully"
                  : "No data found",
                loading: false,
              }
            : r
        )
      );
    } catch {
      setRows((prev) =>
        prev.map((r, i) =>
          i === rowIndex
            ? { ...r, remarks: "Validation failed", loading: false }
            : r
        )
      );
    }
  };

  /* ------------------ VALIDATE ALL ------------------ */
  const validateAll = async () => {
    setValidateAllLoading(true);

    await Promise.all(
      rows.map((_, i) => validateRow(i))
    );

    setValidateAllLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center text-[#133E7C]">
        ODI Report
      </h1>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={validateAll}
          disabled={validateAllLoading}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {validateAllLoading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Validate All
        </button>

        <button className="bg-[#133E7C] text-white px-4 py-2 rounded">
          Export to Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-[#133E7C] text-white">
            <tr>
              <th className="p-2 border">S.No</th>
              <th className="p-2 border">ODI Job Name</th>
              <th className="p-2 border">Execution</th>
              <th className="p-2 border">Job Status</th>
              <th className="p-2 border">Last Updated</th>
              <th className="p-2 border">Current Date</th>
              <th className="p-2 border">Table Status</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Validate</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-gray-50">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{r.job}</td>
                <td className="p-2 border">{r.exec}</td>

                <td className="p-2 border">
                  <select
                    className="border rounded p-1"
                    value={r.jobStatus}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((x, idx) =>
                          idx === i
                            ? { ...x, jobStatus: e.target.value }
                            : x
                        )
                      )
                    }
                  >
                    <option>NOT STARTED</option>
                    <option>RUNNING</option>
                    <option>COMPLETED</option>
                    <option>FAILED</option>
                  </select>
                </td>

                <td className="p-2 border">{r.lastUpdated || "-"}</td>
                <td className="p-2 border">{today}</td>

                <td className="p-2 border">
                  <select
                    className="border rounded p-1"
                    value={r.tableStatus}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((x, idx) =>
                          idx === i
                            ? { ...x, tableStatus: e.target.value }
                            : x
                        )
                      )
                    }
                  >
                    <option>UPDATED</option>
                    <option>NOT UPDATED</option>
                  </select>
                </td>

                <td className="p-2 border">
                  <input
                    className="border rounded p-1 w-full"
                    placeholder="Enter remarks"
                    value={r.remarks}
                    onChange={(e) =>
                      setRows((prev) =>
                        prev.map((x, idx) =>
                          idx === i
                            ? { ...x, remarks: e.target.value }
                            : x
                        )
                      )
                    }
                  />
                </td>

                <td className="p-2 border text-center">
                  <button
                    onClick={() => validateRow(i)}
                    disabled={r.loading}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2 mx-auto"
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
