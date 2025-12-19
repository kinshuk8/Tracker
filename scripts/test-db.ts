import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000, // Fail fast
});

async function testConnection() {
  try {
    console.log("Attempting to connect to:", process.env.DATABASE_URL?.replace(/:[^:@]*@/, ":***@")); // Hide password in logs
    const client = await pool.connect();
    console.log("Connected successfully!");
    const res = await client.query("SELECT NOW()");
    console.log("Query result:", res.rows[0]);
    client.release();
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
