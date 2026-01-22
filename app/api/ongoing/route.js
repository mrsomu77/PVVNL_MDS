// meter-ui/app/api/ongoing/route.js
import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

export async function POST() {
  try {
    const conn = await getDB();

    const sql = `
      SELECT /*+ parallel(24) */
        r.BATCH_CD,
        b.BATCH_JOB_STAT_FLG,
        r.START_DTTM,
        r.END_DTTM,
        COUNT(i.BATCH_THREAD_NBR) AS BATCH_THREAD_CNT,
        ROUND((r.END_DTTM - r.START_DTTM) * 24 * 60 * 60) AS TOTAL_DURATION,
        SUM(i.REC_PROC_CNT) AS TOTAL_RECORDS,
        CASE
            WHEN ROUND((r.END_DTTM - r.START_DTTM) * 24 * 60 * 60) = 0 THEN 0
            ELSE SUM(i.REC_PROC_CNT) /
                 ROUND((r.END_DTTM - r.START_DTTM) * 24 * 60 * 60)
        END AS RPS,
        r.BATCH_BUS_DT,
        r.RUN_STATUS
      FROM ci_batch_run r
      JOIN ci_batch_job b
        ON r.BATCH_CD = b.BATCH_CD
       AND r.BATCH_NBR = b.BATCH_NBR
      JOIN ci_batch_inst i
        ON r.BATCH_CD = i.BATCH_CD
       AND r.BATCH_NBR = i.BATCH_NBR
      WHERE r.BATCH_CD not in ('F1-FLUSH','D1-CREDW','D1-CRERR','CM-CRERR','CMLDALAT','CM_LDALA','CMLDALAK')
        AND r.END_DTTM IS NULL
        AND r.RUN_STATUS = 20
      GROUP BY
        r.BATCH_CD,
        b.BATCH_JOB_STAT_FLG,
        r.START_DTTM,
        r.END_DTTM,
        r.BATCH_BUS_DT,
        r.RUN_STATUS
      ORDER BY r.START_DTTM ASC
    `;

    const result = await conn.execute(sql);
    await conn.close();

    return NextResponse.json({ data: result.rows });
  } catch (err) {
    console.error("ONGOING BATCH ERROR:", err);
    return NextResponse.json({ data: [], error: err.message }, { status: 500 });
  }
}
