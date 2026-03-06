import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

try {
  const connection = await db.getConnection();
  console.log("MySQL Connected");
  connection.release();
} catch (err) {
  console.log("Database connection failed:", err);
}

export default db;