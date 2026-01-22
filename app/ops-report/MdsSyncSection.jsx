"use client";
import { useState } from "react";

export default function MdsSyncSection() {
  const [dates, setDates] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const loadMdsSync = async () => {
    setLoading(true);
    setFetched(true);

    const res = await fetch("/api/mds-sync", { method: "POST" });
    const data = await res.json();

    setDates(data.dates || []);
    setRows(data.rows || []);
    setLoading(false);
  };

  return (
    <div className="bg-white shadow rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold text-[#133E7C]">
        Master Data Sync (Completed)
      </h2>

      <button
        onClick={loadMdsSync}
        disabled={loading}
        className="bg-[#133E7C] text-white px-4 py-2 rounded flex items-center gap-2"
      >
        {loading && (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        Load Data
      </button>

      {fetched && !loading && (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-max text-sm border-collapse">
            <thead className="bg-[#133E7C] text-white">
              <tr>
                <th className="p-2 border sticky left-0 bg-[#133E7C]">
                  Request Type
                </th>
                {dates.map((d) => (
                  <th key={d} className="p-2 border">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-2 border sticky left-0 bg-inherit font-semibold">
                    {r.type}
                  </td>
                  {r.values.map((v, idx) => (
                    <td key={idx} className="p-2 border text-center">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
