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
  console.error("Missing env vars. Ensure NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_PASSWORD are set.");
  process.exit(1);
}

const supabaseUrl = `https://${projectRef}.supabase.co`;
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function reset() {
  console.log(`Target: ${supabaseUrl}\n`);

  // 1. Delete all cards
  const { error: cardsErr, data: cardsData } = await supabase
    .from("cards")
    .delete()
    .not("id", "is", null)
    .select("count");
  console.log(
    cardsErr
      ? `ERR deleting cards: ${cardsErr.message}`
      : `Deleted all cards (table cleared)`
  );

  // 2. Reset edition sequence via direct SQL (needs pg connection)
  const pgClient = new Client({
    connectionString: `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await pgClient.connect();
    await pgClient.query("ALTER SEQUENCE card_edition_seq RESTART WITH 1");
    console.log("Reset card_edition_seq to 1");
    await pgClient.end();
  } catch (err) {
    console.error(`ERR resetting sequence: ${err.message}`);
    console.error("Trying pooler fallback...");
    try {
      const fallback = new Client({
        connectionString: `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
        ssl: { rejectUnauthorized: false },
      });
      await fallback.connect();
      await fallback.query("ALTER SEQUENCE card_edition_seq RESTART WITH 1");
      console.log("Reset card_edition_seq to 1 (via pooler)");
      await fallback.end();
    } catch (err2) {
      console.error(`ERR resetting sequence via pooler: ${err2.message}`);
    }
  }

  // 3. Delete all auth users
  const { data: users, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error(`ERR listing auth users: ${listErr.message}`);
  } else if (users?.users?.length) {
    console.log(`Found ${users.users.length} auth user(s) to delete...`);
    for (const u of users.users) {
      const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
      if (delErr) console.error(`ERR deleting user ${u.email} (${u.id}): ${delErr.message}`);
      else console.log(`Deleted user ${u.email || u.id}`);
    }
  } else {
    console.log("No auth users to delete");
  }

  console.log("\nReset complete. Database is clean and ready for migration.");
}

reset();
