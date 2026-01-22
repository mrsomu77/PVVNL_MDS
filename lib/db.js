// meter-ui/lib/db.js
import oracledb from "oracledb";

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION,
};

export async function getDB() {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (err) {
    console.error("DB CONNECT ERROR:", err);
    throw err;
  }
}
