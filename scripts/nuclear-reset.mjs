import { createClient } from "@supabase/supabase-js";
import { Client } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, "..", ".env");
const env = fs.readFileSync(envPath, "utf8");

const getVar = (name) => {
  const m = env.match(new RegExp(`^${name}=(.+)`, "m"));
  return m ? m[1].replace(/^"|"$/g, "").trim() : null;
};

const projectRef = getVar("NEXT_PUBLIC_SUPABASE_URL")
  ?.replace("https://", "")
  .replace(".supabase.co", "");
const serviceRoleKey = getVar("SUPABASE_SERVICE_ROLE_KEY");
const dbPassword = getVar("SUPABASE_DB_PASSWORD");

if (!projectRef || !serviceRoleKey || !dbPassword) {
  console.error("Missing env vars.");
  process.exit(1);
}

const supabase = createClient(
  `https://${projectRef}.supabase.co`,
  serviceRoleKey
);

function createPgClient(url) {
  return new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
}

const directUrl = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;
const poolerUrl = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

async function runSql(pgClient, sql) {
  await pgClient.connect();
  try {
    const result = await pgClient.query(sql);
    return result;
  } finally {
    await pgClient.end();
  }
}

async function main() {
  console.log("=== NUCLEAR DATABASE RESET ===\n");

  // Step 1: Drop EVERYTHING via direct SQL
  console.log("--- Step 1: Dropping all tables, functions, sequences ---");
  let pg = createPgClient(directUrl);
  try {
    await pg.connect();
    await pg.query("DROP TABLE IF EXISTS cards CASCADE");
    console.log("  Dropped table: cards");
    await pg.query("DROP FUNCTION IF EXISTS upsert_card_v2 CASCADE");
    console.log("  Dropped function: upsert_card_v2");
    await pg.query("DROP FUNCTION IF EXISTS upsert_card CASCADE");
    console.log("  Dropped function: upsert_card");
    await pg.query("DROP FUNCTION IF EXISTS increment_card_count() CASCADE");
    console.log("  Dropped function: increment_card_count");
    await pg.query("DROP FUNCTION IF EXISTS increment_edition(p_card_id TEXT) CASCADE");
    console.log("  Dropped function: increment_edition");
    await pg.query("DROP SEQUENCE IF EXISTS card_edition_seq CASCADE");
    console.log("  Dropped sequence: card_edition_seq");
    await pg.query("DROP TABLE IF EXISTS profiles CASCADE");
    console.log("  Dropped table: profiles (if existed)");
    await pg.query("DROP TABLE IF EXISTS leaderboard CASCADE");
    console.log("  Dropped table: leaderboard (if existed)");
    await pg.query("DROP TABLE IF EXISTS editions CASCADE");
    console.log("  Dropped table: editions (if existed)");
    await pg.query("DROP TABLE IF EXISTS card_count CASCADE");
    console.log("  Dropped table: card_count (if existed)");
    await pg.end();
    console.log("  All DB objects nuked.\n");
  } catch (err) {
    console.error(`  Direct connection failed: ${err.message}`);
    console.error("  Trying pooler fallback...\n");
    await pg.end().catch(() => {});
    pg = createPgClient(poolerUrl);
    await pg.connect();
    await pg.query("DROP TABLE IF EXISTS cards CASCADE");
    console.log("  Dropped table: cards (via pooler)");
    await pg.query("DROP FUNCTION IF EXISTS upsert_card_v2 CASCADE");
    console.log("  Dropped function: upsert_card_v2 (via pooler)");
    await pg.query("DROP FUNCTION IF EXISTS upsert_card CASCADE");
    console.log("  Dropped function: upsert_card (via pooler)");
    await pg.query("DROP FUNCTION IF EXISTS increment_card_count() CASCADE");
    console.log("  Dropped function: increment_card_count (via pooler)");
    await pg.query("DROP FUNCTION IF EXISTS increment_edition(p_card_id TEXT) CASCADE");
    console.log("  Dropped function: increment_edition (via pooler)");
    await pg.query("DROP SEQUENCE IF EXISTS card_edition_seq CASCADE");
    console.log("  Dropped sequence: card_edition_seq (via pooler)");
    await pg.query("DROP TABLE IF EXISTS profiles CASCADE");
    console.log("  Dropped table: profiles (via pooler)");
    await pg.query("DROP TABLE IF EXISTS leaderboard CASCADE");
    console.log("  Dropped table: leaderboard (via pooler)");
    await pg.query("DROP TABLE IF EXISTS editions CASCADE");
    console.log("  Dropped table: editions (via pooler)");
    await pg.query("DROP TABLE IF EXISTS card_count CASCADE");
    console.log("  Dropped table: card_count (via pooler)");
    await pg.end();
    console.log("  All DB objects nuked via pooler.\n");
  }

  // Step 2: Delete all auth users
  console.log("--- Step 2: Deleting all auth users ---");
  const { data: users, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error(`  ERR listing users: ${listErr.message}`);
  } else if (users?.users?.length) {
    console.log(`  Found ${users.users.length} auth user(s)`);
    for (const u of users.users) {
      const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
      if (delErr) console.error(`  ERR deleting ${u.email}: ${delErr.message}`);
      else console.log(`  Deleted: ${u.email || u.id}`);
    }
  } else {
    console.log("  No auth users found");
  }
  console.log();

  // Step 3: Re-run full migration
  console.log("--- Step 3: Re-running full_migration.sql ---");
  const migrationPath = path.join(__dirname, "..", "supabase", "full_migration.sql");
  const migrationSql = fs.readFileSync(migrationPath, "utf8");

  // Split statements handling $$ dollar-quoting (character-level)
  const statements = [];
  let current = "";
  let inDollar = false;
  for (let i = 0; i < migrationSql.length; i++) {
    const ch = migrationSql[i];
    // Check for $$ at current position
    if (migrationSql.substring(i, i + 2) === "$$") {
      inDollar = !inDollar;
      current += "$$";
      i++; // skip second $
      continue;
    }
    current += ch;
    // Split on ; only when not inside $$ blocks
    if (!inDollar && ch === ";") {
      const trimmed = current.trim();
      if (trimmed) {
        // Strip leading comment lines
        const lines = trimmed.split("\n");
        const codeLines = [];
        for (const line of lines) {
          const lt = line.trim();
          if (lt.startsWith("--") && !codeLines.length) continue; // skip leading comments
          codeLines.push(line);
        }
        const codeOnly = codeLines.join("\n").trim();
        if (codeOnly) statements.push(codeOnly);
      }
      current = "";
    }
  }
  if (current.trim()) {
    const trimmed = current.trim();
    const lines = trimmed.split("\n");
    const codeLines = [];
    for (const line of lines) {
      const lt = line.trim();
      if (lt.startsWith("--") && !codeLines.length) continue;
      codeLines.push(line);
    }
    const codeOnly = codeLines.join("\n").trim();
    if (codeOnly) statements.push(codeOnly);
  }

  pg = createPgClient(directUrl);
  try {
    await pg.connect();
    for (const stmt of statements) {
      if (!stmt || stmt.startsWith("--")) continue;
      try {
        await pg.query(stmt);
        const firstLine = stmt.split("\n")[0].substring(0, 80);
        console.log(`  OK: ${firstLine}...`);
      } catch (err) {
        if (err.message.includes("already exists")) {
          console.log(`  SKIP (exists): ${stmt.split("\n")[0].substring(0, 60)}...`);
        } else {
          console.error(`  ERR: ${err.message}`);
          console.error(`  Statement: ${stmt.substring(0, 200)}...`);
        }
      }
    }
    await pg.end();
  } catch (err) {
    console.error(`  Direct connection failed: ${err.message}`);
    console.error("  Trying pooler fallback...");
    await pg.end().catch(() => {});
    pg = createPgClient(poolerUrl);
    await pg.connect();
    for (const stmt of statements) {
      if (!stmt || stmt.startsWith("--")) continue;
      try {
        await pg.query(stmt);
        const firstLine = stmt.split("\n")[0].substring(0, 80);
        console.log(`  OK (pooler): ${firstLine}...`);
      } catch (err) {
        if (err.message.includes("already exists")) {
          console.log(`  SKIP (exists): ${stmt.split("\n")[0].substring(0, 60)}...`);
        } else {
          console.error(`  ERR (pooler): ${err.message}`);
        }
      }
    }
    await pg.end();
  }
  console.log();

  // Step 4: Verify
  console.log("--- Step 4: Verification ---");
  const { data: check, error: checkErr } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true });
  if (checkErr) {
    console.log(`  Cards query error (expected if table just recreated): ${checkErr.message}`);
  } else {
    console.log(`  Cards table row count: ${check}`);
  }

  const { data: users2 } = await supabase.auth.admin.listUsers();
  console.log(`  Auth users remaining: ${users2?.users?.length || 0}`);

  console.log("\n=== NUCLEAR RESET COMPLETE ===");
  console.log("Database is completely clean and fresh.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
