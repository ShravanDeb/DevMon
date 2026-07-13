import pg from "pg";

const POOLER_HOST = "aws-0-us-east-1.pooler.supabase.com";
const PROJECT_REF = "sqnycndqbbychopyzntw";
const PASSWORD = "DfI1k1sh80zUqxCJ";

async function tryConnect(host) {
  const connStr = `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${host}:6543/postgres`;
  console.log(`Trying: ${host}...`);
  const client = new pg.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}

async function main() {
  let client;
  const hosts = [
    "aws-0-us-east-1.pooler.supabase.com",
    "aws-0-us-west-1.pooler.supabase.com",
    "aws-0-us-west-2.pooler.supabase.com",
    "aws-0-ap-southeast-1.pooler.supabase.com",
    "aws-0-ap-southeast-2.pooler.supabase.com",
    "aws-0 eu-west-1.pooler.supabase.com",
    "aws-0-eu-central-1.pooler.supabase.com",
    "aws-0-sa-east-1.pooler.supabase.com",
  ];

  for (const h of hosts) {
    try {
      client = await tryConnect(h);
      console.log(`Connected via ${h}`);
      break;
    } catch (e) {
      console.log(`  Failed: ${e.message.split("\n")[0]}`);
    }
  }

  if (!client) {
    console.error("Could not connect to any pooler host. Trying direct connection...");
    try {
      const directUrl = `postgresql://postgres:${PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`;
      client = new pg.Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
      await client.connect();
      console.log("Connected via direct connection");
    } catch (e) {
      console.error("Direct connection also failed:", e.message.split("\n")[0]);
      process.exit(1);
    }
  }

  console.log("\n=== Connected. Running full reset ===\n");

  const sql = `
-- 1. Drop everything
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access on profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can read card count" ON card_count;
DROP POLICY IF EXISTS "Authenticated can read card count" ON card_count;
DROP POLICY IF EXISTS "Service role full access on card count" ON card_count;
DROP POLICY IF EXISTS "Service role full access on editions" ON editions;
DROP POLICY IF EXISTS "Anyone can read leaderboard" ON leaderboard;
DROP POLICY IF EXISTS "Authenticated can read leaderboard" ON leaderboard;
DROP POLICY IF EXISTS "Service role full access on leaderboard" ON leaderboard;

DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS editions CASCADE;
DROP TABLE IF EXISTS card_count CASCADE;

DROP FUNCTION IF EXISTS increment_card_count() CASCADE;
DROP FUNCTION IF EXISTS increment_edition(TEXT) CASCADE;

-- 2. Recreate schema (001_initial_schema.sql)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  stats JSONB,
  card JSONB,
  company TEXT,
  primary_language TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS card_count (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO card_count (id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS editions (
  card_id TEXT PRIMARY KEY,
  edition INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS leaderboard (
  username TEXT PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  rarity TEXT NOT NULL,
  rarity_score INTEGER NOT NULL DEFAULT 0,
  primary_class TEXT NOT NULL,
  stats JSONB,
  company TEXT,
  primary_language TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_rarity_score ON leaderboard (rarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_company ON leaderboard (company);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles (updated_at);

-- 3. Recreate RLS policies (002_rls_policies.sql)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_count ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role full access on profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read card count"
  ON card_count FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read card count"
  ON card_count FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role full access on card count"
  ON card_count FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on editions"
  ON editions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read leaderboard"
  ON leaderboard FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role full access on leaderboard"
  ON leaderboard FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Recreate functions (003_functions.sql)
CREATE OR REPLACE FUNCTION increment_card_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE card_count SET count = count + 1 WHERE id = 1 RETURNING count INTO new_count;
  IF new_count IS NULL THEN
    INSERT INTO card_count (id, count) VALUES (1, 1) RETURNING count INTO new_count;
  END IF;
  RETURN new_count;
END;
$$;

CREATE OR REPLACE FUNCTION increment_edition(p_card_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_edition INTEGER;
BEGIN
  INSERT INTO editions (card_id, edition)
  VALUES (p_card_id, 1)
  ON CONFLICT (card_id) DO UPDATE
    SET edition = editions.edition + 1
  RETURNING edition INTO new_edition;
  RETURN new_edition;
END;
$$;

-- 5. Migration 004: UNIQUE constraint on user_id for onConflict upsert
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
`;

  try {
    await client.query(sql);
    console.log("All SQL executed successfully.\n");
  } catch (e) {
    console.error("SQL error:", e.message);
    console.error("Detail:", e.detail);
  }

  // Verify
  console.log("=== Verification ===");
  for (const t of ["profiles", "leaderboard", "editions", "card_count"]) {
    const r = await client.query(`SELECT count(*) as count FROM ${t}`);
    console.log(`  ${t}: ${r.rows[0].count} rows`);
  }

  // Verify constraints
  const constraints = await client.query(`
    SELECT conname, contype, conrelid::regclass as table_name
    FROM pg_constraint
    WHERE connamespace = 'public'::regnamespace
    ORDER BY conrelid::regclass::text, contype
  `);
  console.log("\n=== Constraints ===");
  for (const c of constraints.rows) {
    const type = { p: "PK", u: "UNIQUE", f: "FK", c: "CHECK" }[c.contype] || c.contype;
    console.log(`  ${c.table_name}: ${type} (${c.conname})`);
  }

  await client.end();
  console.log("\nDone.");
}

main();
