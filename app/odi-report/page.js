"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatToIST } from "../../lib/date";
import { ODI_STATIC_ROWS } from "./odiStaticRows";

export default function OdiReport() {
  const [rows, setRows] = useState([]);
  const [validatingAll, setValidatingAll] = useState(false);
  const [validatingRow, setValidatingRow] = useState({});

  // Load static rows on mount
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const initial = ODI_STATIC_ROWS.map((r) => ({
      ...r,
      jobStatus: "NOT STARTED",
      lastUpdated: "-",
      currentDate: today,
      tableStatus: "NOT UPDATED",
      remarks: "",
    }));

    setRows(initial);
  }, []);

  // ===============================
  // EXPORT TO EXCEL
  // ===============================
  const exportToExcel = () => {
    const data = rows.map((r, i) => ({
      "S.No": i + 1,
      "ODI Job Name": r.job,
      Execution: r.execution,
      "Job Status": r.jobStatus,
      "Last Updated": r.lastUpdated || "-",
      "Current Date": r.currentDate,
      "Table Status": r.tableStatus,
      Remarks: r.remarks || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ODI Report");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      `ODI_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // ===============================
  // VALIDATE SINGLE ROW
  // ===============================
  const validateOne = async (index) => {
    const execution = rows[index].execution;

    setValidatingRow((prev) => ({ ...prev, [index]: true }));

    try {
      const res = await fetch("/api/odi/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ execution }),
      });

      const data = await res.json();

      setRows((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          lastUpdated: data.lastUpdated
            ? formatToIST(data.lastUpdated)
            : "-",
          tableStatus: data.updated ? "UPDATED" : "NOT UPDATED",
          remarks: data.updated ? "Validated successfully" : "No data found",
        };
        return copy;
      });
    } catch (e) {
      setRows((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          remarks: "Validation failed",
        };
        return copy;
      });
    } finally {
      setValidatingRow((prev) => ({ ...prev, [index]: false }));
    }
  };

  // ===============================
  // VALIDATE ALL (PARALLEL)
  // ===============================
  const validateAll = async () => {
    setValidatingAll(true);

    await Promise.all(rows.map((_, i) => validateOne(i)));

    setValidatingAll(false);
    alert("Validation completed for all rows");
  };

  // ===============================
  // GROUP BY JOB NAME
  // ===============================
  const grouped = rows.reduce((acc, row) => {
    acc[row.job] = acc[row.job] || [];
    acc[row.job].push(row);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#133E7C]">ODI Report</h1>

        <div className="flex gap-3">
          <button
            onClick={validateAll}
            disabled={validatingAll}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {validatingAll && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Validate All
          </button>

          <button
            onClick={exportToExcel}
            className="bg-[#133E7C] text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-[#133E7C] text-white sticky top-0">
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
            {Object.entries(grouped).map(([jobName, jobRows], jobIdx) => (
              <>
                {/* JOB HEADER */}
                <tr key={jobName} className="bg-gray-200 font-semibold">
                  <td colSpan={9} className="p-2 text-left">
                    {jobName}
                  </td>
                </tr>

                {/* JOB ROWS */}
                {jobRows.map((r, i) => {
                  const globalIndex = rows.indexOf(r);

                  return (
                    <tr key={`${jobName}-${i}`}>
                      <td className="p-2 border">{globalIndex + 1}</td>
                      <td className="p-2 border">{r.job}</td>
                      <td className="p-2 border">{r.execution}</td>

                      <td className="p-2 border">
                        <select
                          value={r.jobStatus}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRows((prev) => {
                              const copy = [...prev];
                              copy[globalIndex] = {
                                ...copy[globalIndex],
                                jobStatus: val,
                              };
                              return copy;
                            });
                          }}
                          className="border rounded px-2 py-1"
                        >
                          <option>NOT STARTED</option>
                          <option>RUNNING</option>
                          <option>COMPLETED</option>
                          <option>FAILED</option>
                        </select>
                      </td>

                      <td className="p-2 border">
                        {r.lastUpdated || "-"}
                      </td>

                      <td className="p-2 border">
                        {r.currentDate}
                      </td>

                      <td className="p-2 border">
                        <select
                          value={r.tableStatus}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRows((prev) => {
                              const copy = [...prev];
                              copy[globalIndex] = {
                                ...copy[globalIndex],
                                tableStatus: val,
                              };
                              return copy;
                            });
                          }}
                          className="border rounded px-2 py-1"
                        >
                          <option>UPDATED</option>
                          <option>NOT UPDATED</option>
                        </select>
                      </td>

                      <td className="p-2 border">
                        <input
                          value={r.remarks || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRows((prev) => {
                              const copy = [...prev];
                              copy[globalIndex] = {
                                ...copy[globalIndex],
                                remarks: val,
                              };
                              return copy;
                            });
                          }}
                          placeholder="Enter remarks"
                          className="border px-2 py-1 rounded w-full"
                        />
                      </td>

                      <td className="p-2 border text-center">
                        <button
                          onClick={() => validateOne(globalIndex)}
                          disabled={validatingRow[globalIndex]}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          {validatingRow[globalIndex]
                            ? "Validating..."
                            : "Validate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
