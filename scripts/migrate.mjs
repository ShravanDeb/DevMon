import pg from "pg";
import { readFileSync } from "fs";

const { Client } = pg;

const client = new Client({
  host: "db.dfnbjvecciwflyzcjsgb.supabase.co",
  port: 5432,
  user: "postgres",
  password: "ZHiGpeB5nrJ2nt3c",
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Connected to postgres");

  const sql = readFileSync("supabase/full_migration.sql", "utf8");
  await client.query(sql);
  console.log("Migration SQL executed");

  const tables = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
  );
  console.log("Tables:", tables.rows.map((r) => r.tablename).join(", "));

  const funcs = await client.query(
    "SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace"
  );
  console.log("Functions:", funcs.rows.map((r) => r.proname).join(", "));

  await client.end();
  console.log("Done");
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
}
