import { NextResponse } from "next/server";
import { getDB } from "../../../lib/db";

function convertToOracle(dateStr) {
  // Input: YYYY-MM-DDTHH:mm
  const [datePart, timePart] = dateStr.split("T");
  const [yyyy, mm, dd] = datePart.split("-");
  return `${dd}-${mm}-${yyyy} ${timePart}:00`;
}

export async function POST(req) {
  try {
    const { from, to } = await req.json();
    const conn = await getDB();

    const sql = `
      SELECT /*+ parallel(24) */
          r.BATCH_CD AS batch_cd,
          r.BATCH_NBR AS batch_nbr,
          r.RUN_STATUS AS run_status,
          r.BATCH_BUS_DT AS batch_bus_dt,
          r.START_DTTM AS start_dttm,
          r.END_DTTM AS end_dttm,
          SUM(i.REC_PROC_CNT) AS records,
          COUNT(i.BATCH_THREAD_NBR) AS threads,
          ROUND((r.END_DTTM - r.START_DTTM) * 24 * 60 * 60) AS duration,
          b.BATCH_JOB_ID AS batch_job_id,
          CASE
            WHEN r.END_DTTM IS NULL
              OR ROUND((r.END_DTTM - r.START_DTTM) * 24 * 60 * 60) = 0
            THEN 0
            ELSE
              SUM(i.REC_PROC_CNT) /
              ROUND((r.END_DTTM - r.START_DTTM) * 24 * 60 * 60)
          END AS RPS,
          p.BATCH_PARM_VAL AS batch_param_val
      FROM ci_batch_run r
      LEFT JOIN ci_batch_inst i
        ON r.BATCH_CD = i.BATCH_CD
       AND r.BATCH_NBR = i.BATCH_NBR
      LEFT JOIN ci_batch_job b
        ON r.BATCH_CD = b.BATCH_CD
       AND r.BATCH_NBR = b.BATCH_NBR
      LEFT JOIN ci_batch_job_prm p
        ON b.BATCH_JOB_ID = p.BATCH_JOB_ID
       AND p.BATCH_PARM_NAME = 'restrictToBusinessObject'
      WHERE r.BATCH_CD NOT IN ('CM_LDALA','CMLDALAT','CMLDALAK','F1-FLUSH','D1-CREDW','D1-CRERR','CM-CRERR')
        AND r.START_DTTM BETWEEN
            TO_DATE(:p_from,'DD-MM-YYYY HH24:MI:SS')
        AND TO_DATE(:p_to,'DD-MM-YYYY HH24:MI:SS')
      GROUP BY
          r.BATCH_CD,
          r.BATCH_NBR,
          r.RUN_STATUS,
          r.BATCH_BUS_DT,
          r.START_DTTM,
          r.END_DTTM,
          b.BATCH_JOB_ID,
          p.BATCH_PARM_VAL
      ORDER BY r.START_DTTM ASC
    `;

    const result = await conn.execute(sql, {
      p_from: convertToOracle(from),
      p_to: convertToOracle(to),
    });

    await conn.close();
    return NextResponse.json({ data: result.rows });

  } catch (err) {
    console.error("OPS QUERY ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
