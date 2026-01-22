"use client";
import { useState } from "react";
import { formatToIST } from "../../lib/date";
import { ODI_JOBS } from "./odiStaticData";

export default function OdiReport() {
  const today = new Date().toLocaleDateString("en-IN");

  const [rows, setRows] = useState(
    ODI_JOBS.flatMap((job, jIdx) =>
      job.executions.map((exe, eIdx) => ({
        id: `${jIdx}-${eIdx}`,
        jobName: job.jobName,
        execution: exe,
        jobStatus: "NOT STARTED",
        tableStatus: "NOT UPDATED",
        lastUpdated: null,
        remarks: "",
        loading: false,
      }))
    )
  );

  const validateRow = async (id, execution) => {
    setRows(r =>
      r.map(row =>
        row.id === id ? { ...row, loading: true } : row
      )
    );

    const res = await fetch("/api/odi/validate", {
      method: "POST",
      body: JSON.stringify({ execution }),
    });
    const data = await res.json();

    setRows(r =>
      r.map(row =>
        row.id === id
          ? {
              ...row,
              lastUpdated: data.value,
              tableStatus: data.value ? "UPDATED" : "NOT UPDATED",
              loading: false,
            }
          : row
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center text-[#133E7C] mb-4">
        ODI Report
      </h1>

      <div className="overflow-x-auto border rounded bg-white">
        <table className="min-w-max text-sm">
          <thead className="bg-[#133E7C] text-white">
            <tr>
              <th>S.No</th>
              <th>ODI Job Name</th>
              <th>Execution</th>
              <th>Job Status</th>
              <th>Last Updated</th>
              <th>Current Date</th>
              <th>Table Status</th>
              <th>Remarks</th>
              <th>Validate</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.jobName}</td>
                <td>{r.execution}</td>

                <td>
                  <select
                    value={r.jobStatus}
                    onChange={e =>
                      setRows(rows =>
                        rows.map(row =>
                          row.id === r.id
                            ? { ...row, jobStatus: e.target.value }
                            : row
                        )
                      )
                    }
                  >
                    <option>COMPLETED</option>
                    <option>RUNNING</option>
                    <option>NOT STARTED</option>
                    <option>FAILED</option>
                  </select>
                </td>

                <td>
                  {r.lastUpdated ? formatToIST(r.lastUpdated) : "-"}
                </td>

                <td>{today}</td>

                <td>
                  <select
                    value={r.tableStatus}
                    onChange={e =>
                      setRows(rows =>
                        rows.map(row =>
                          row.id === r.id
                            ? { ...row, tableStatus: e.target.value }
                            : row
                        )
                      )
                    }
                  >
                    <option>UPDATED</option>
                    <option>NOT UPDATED</option>
                  </select>
                </td>

                <td>
                  <input
                    value={r.remarks}
                    onChange={e =>
                      setRows(rows =>
                        rows.map(row =>
                          row.id === r.id
                            ? { ...row, remarks: e.target.value }
                            : row
                        )
                      )
                    }
                    placeholder="Enter remarks"
                    className="border px-2"
                  />
                </td>

                <td>
                  <button
                    onClick={() => validateRow(r.id, r.execution)}
                    disabled={r.loading}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    {r.loading ? "Validating..." : "Validate"}
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
