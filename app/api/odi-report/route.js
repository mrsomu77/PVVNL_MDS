// app/api/odi-report/route.js
import { NextResponse } from "next/server";
import { getOdiDB } from "../../../lib/db-odi";

export async function POST() {
  let conn;

  try {
    conn = await getOdiDB();

    const q1 = await conn.execute(
      `SELECT MAX(READ_DATE) FROM CM_INTERVAL_TREND`
    );

    const q2 = await conn.execute(
      `SELECT MAX(CRE_DTTM) FROM CM_INTERVAL_SUM`
    );

    return NextResponse.json({
      data: [
        {
          jobName: "CONSUMPTION_BATCH",
          tableName: "CM_INTERVAL_TREND",
          lastUpdated: q1.rows[0][0],
        },
        {
          jobName: "CONSUMPTION_BATCH",
          tableName: "CM_INTERVAL_SUM",
          lastUpdated: q2.rows[0][0],
        },
      ],
    });

  } catch (err) {
    console.error("ODI REPORT API ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  } finally {
    if (conn) await conn.close();
  }
}
