import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool(process.env.DATABASE_URL);

db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");
    connection.release();
  }
});

export default db;