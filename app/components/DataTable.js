"use client";

export default function DataTable({ columns, rows, emptyText = "No data" }) {
  return (
    <div className="mt-4 border rounded overflow-hidden">
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-[#133E7C] text-white z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-3 py-2 border border-[#0f2f5c] text-left whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  {row.map((cell, cidx) => (
                    <td
                      key={cidx}
                      className="px-3 py-2 border border-gray-300 whitespace-nowrap"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
