// lib/db-odi.js
import oracledb from "oracledb";

export async function getOdiDB() {
  try {
    return await oracledb.getConnection({
      user: process.env.ODI_DB_USER,
      password: process.env.ODI_DB_PASSWORD,
      connectString: `${process.env.ODI_DB_HOST}:${process.env.ODI_DB_PORT}/${process.env.ODI_DB_SERVICE}`,
    });
  } catch (err) {
    console.error("ODI DB CONNECT ERROR:", err);
    throw err;
  }
}
