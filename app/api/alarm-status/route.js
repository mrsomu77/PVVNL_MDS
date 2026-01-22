// app/api/alarm-status/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";
import oracledb from "oracledb";

export async function POST() {
  let conn;
  try {
    conn = await getDB();

    const sql = `
      
SELECT /*+ parallel(24) */
          batch_cd,
          run_status,
          start_dttm,
          end_dttm,
          records,
          threads,
          duration,
          CASE 
              WHEN duration = 0 THEN 0
              ELSE records / duration
          END AS rps
      FROM (
          SELECT
              r.batch_cd,
              r.run_status,
              r.start_dttm,
              r.end_dttm,
              SUM(i.rec_proc_cnt) AS records,
              COUNT(i.batch_thread_nbr) AS threads,
              ROUND((r.end_dttm - r.start_dttm) * 86400) AS duration,
              ROW_NUMBER() OVER (
                  PARTITION BY r.batch_cd
                  ORDER BY r.start_dttm DESC
              ) AS rn
          FROM ci_batch_run r
          LEFT JOIN ci_batch_inst i
              ON r.batch_cd = i.batch_cd
             AND r.batch_nbr = i.batch_nbr
          WHERE r.batch_cd IN ('CMLDALAT','CM_LDALA','CMLDALAK')
          GROUP BY
              r.batch_cd,
              r.batch_nbr,
              r.run_status,
              r.start_dttm,
              r.end_dttm
      )
      WHERE rn = 1
      ORDER BY BATCH_CD
    `;

    const result = await conn.execute(sql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const rows = result.rows.map((r) => ({
      batch: r.BATCH_CD,
      runStatus: r.RUN_STATUS,
      start: r.START_DTTM ? r.START_DTTM.toISOString() : null,
      end: r.END_DTTM ? r.END_DTTM.toISOString() : null,
      records: r.RECORDS,
      threads: r.THREADS,
      duration: r.DURATION,
      rps: r.RPS,
    }));

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("ALARM STATUS API ERROR:", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch {}
    }
  }
}
