import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

/* ---------- SAFE DATE CONVERTER ---------- */
function convertToOracle(dateStr) {
  if (!dateStr) return null;

  // Expected: YYYY-MM-DDTHH:mm
  const [datePart, timePart] = dateStr.split("T");
  if (!datePart || !timePart) return null;

  const [yyyy, mm, dd] = datePart.split("-");
  return `${dd}-${mm}-${yyyy} ${timePart}:00`;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const p_from = convertToOracle(body.from);
    const p_to = convertToOracle(body.to);

    if (!p_from || !p_to) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 }
      );
    }

    const conn = await getDB();

    const sql = `
      SELECT BUS_OBJ_CD, BO_STATUS_CD, COUNT(1)
      FROM CISADM.D1_IMD_CTRL
      WHERE CRE_DTTM BETWEEN
            TO_DATE(:p_from,'DD-MM-YYYY HH24:MI:SS')
        AND TO_DATE(:p_to,'DD-MM-YYYY HH24:MI:SS')
      GROUP BY BUS_OBJ_CD, BO_STATUS_CD
      ORDER BY BUS_OBJ_CD
    `;

    const result = await conn.execute(sql, {
      p_from,
      p_to,
    });

    await conn.close();

    return NextResponse.json({ data: result.rows });

  } catch (err) {
    console.error("IMD API ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
