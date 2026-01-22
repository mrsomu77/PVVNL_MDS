import { NextResponse } from "next/server";
import { getOdiDB } from "../../../../lib/db-odi";
import { ODI_QUERY_MAP } from "../queryMap";

export async function POST(req) {
  const { execution } = await req.json();

  const cfg = ODI_QUERY_MAP[execution];

  if (!cfg) {
    return NextResponse.json({
      updated: false,
      lastUpdated: null,
      message: "Invalid execution name",
    });
  }

  let conn;
  try {
    conn = await getOdiDB();

    const result = await conn.execute(cfg.sql);

    let lastUpdated = null;

    if (result.rows && result.rows.length > 0) {
      lastUpdated = result.rows[0][0] || null;
    }

    return NextResponse.json({
      updated: !!lastUpdated,
      lastUpdated, // raw DB value (UI will format to IST)
    });

  } catch (err) {
    console.error("ODI VALIDATE ERROR:", err);

    return NextResponse.json({
      updated: false,
      lastUpdated: null,
      message: "Query execution failed",
    });
  } finally {
    if (conn) await conn.close();
  }
}
