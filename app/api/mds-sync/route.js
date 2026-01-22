// app/api/mds-sync/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function POST() {
  let conn;

  try {
    conn = await getDB();

    const sql = `
      WITH
        params AS (
          SELECT
            TRUNC(SYSDATE) AS today,
            TRUNC(SYSDATE, 'MM') AS month_start,
            ADD_MONTHS(TRUNC(SYSDATE, 'MM'), 1) AS next_month_start
          FROM dual
        ),
        dates AS (
          SELECT p.month_start + LEVEL - 1 AS request_date
          FROM params p
          CONNECT BY LEVEL <= (p.today - p.month_start + 1)
        ),
        types AS (
          SELECT 'CM-CompsiteSyncReq' AS bus_obj_cd FROM dual
          UNION ALL
          SELECT 'CM-SM-TO-SMSYNCREQ' FROM dual
        ),
        aggregated AS (
          SELECT /*+ PARALLEL(15) */
            TRUNC(t.CRE_DTTM) AS request_date,
            t.BUS_OBJ_CD,
            COUNT(
              CASE
                WHEN t.BO_STATUS_CD IS NULL
                  OR t.BO_STATUS_CD NOT IN ('ERROR','PENDING')
                THEN 1
              END
            ) AS completed_records
          FROM CISADM.F1_SYNC_REQ_IN t
          JOIN params p
            ON t.CRE_DTTM >= p.month_start
           AND t.CRE_DTTM <  p.next_month_start
          WHERE t.BUS_OBJ_CD IN ('CM-CompsiteSyncReq','CM-SM-TO-SMSYNCREQ')
          GROUP BY TRUNC(t.CRE_DTTM), t.BUS_OBJ_CD
        )
      SELECT
        d.request_date,
        ty.bus_obj_cd,
        NVL(a.completed_records, 0) AS completed_records
      FROM dates d
      CROSS JOIN types ty
      LEFT JOIN aggregated a
        ON a.request_date = d.request_date
       AND a.bus_obj_cd   = ty.bus_obj_cd
      ORDER BY d.request_date ASC, ty.bus_obj_cd
    `;

    const result = await conn.execute(sql);

    const rows = result.rows;

    // --- transform for UI ---
    const dates = [
      ...new Set(rows.map(r => r[0].toISOString().slice(0, 10)))
    ];

    const map = {};
    rows.forEach(([date, type, count]) => {
      const d = date.toISOString().slice(0, 10);
      if (!map[type]) map[type] = {};
      map[type][d] = count;
    });

    const output = Object.keys(map).map(type => ({
      type,
      values: dates.map(d => map[type][d] ?? 0)
    }));

    return NextResponse.json({ dates, rows: output });

  } catch (err) {
    console.error("MDS SYNC ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (conn) await conn.close();
  }
}
