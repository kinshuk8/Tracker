import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

const isProduction = process.env.NODE_ENV === "production";

// Use a global variable to store the database connection in development
// to prevent connection exhaustion during hot reloads.
// We need to properly type the DB with schema
type DB = NodePgDatabase<typeof schema>;

const globalForDb = global as unknown as { db: DB | undefined };

let db: DB;

if (isProduction) {
    const pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 10000,
        ssl: connectionString.includes("localhost") ? false : {
            rejectUnauthorized: false
        },
    });
    db = drizzle(pool, { schema });
} else {
    if (!globalForDb.db) {
        const pool = new Pool({
            connectionString,
            connectionTimeoutMillis: 10000,
            ssl: connectionString.includes("localhost") ? false : {
                rejectUnauthorized: false
            },
        });
        globalForDb.db = drizzle(pool, { schema });
    }
    db = globalForDb.db;
}

export { db };
