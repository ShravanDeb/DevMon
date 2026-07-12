-- DevMon Database Schema
-- Applied via Supabase migrations

-- Profiles: stores fetched GitHub stats and generated card data per user
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,                -- GitHub username (login)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  stats JSONB,                        -- Raw GitHub stats (cached)
  card JSONB,                         -- Generated card data
  company TEXT,
  primary_language TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Card count tracking for landing page counter
CREATE TABLE IF NOT EXISTS card_count (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO card_count (id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Edition counter for per-card edition numbers
CREATE TABLE IF NOT EXISTS editions (
  card_id TEXT PRIMARY KEY,
  edition INTEGER NOT NULL
);

-- Leaderboard: public ranking of generated cards
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_rarity_score ON leaderboard (rarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_company ON leaderboard (company);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles (updated_at);


-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_count ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──
-- Authenticated users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can do everything (writes come through API routes using service key)
CREATE POLICY "Service role full access on profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── CARD_COUNT ──
-- Anyone can read the count (public landing page counter)
CREATE POLICY "Anyone can read card count"
  ON card_count FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read card count"
  ON card_count FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can update (increment)
CREATE POLICY "Service role full access on card count"
  ON card_count FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── EDITIONS ──
-- Service role only (edition numbers are internal)
CREATE POLICY "Service role full access on editions"
  ON editions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── LEADERBOARD ──
-- Anyone can read (public leaderboard)
CREATE POLICY "Anyone can read leaderboard"
  ON leaderboard FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can read leaderboard"
  ON leaderboard FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can write (upserts come through API routes)
CREATE POLICY "Service role full access on leaderboard"
  ON leaderboard FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- Database functions for atomic operations

-- Atomic card count increment (avoids race condition)
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

-- Atomic edition increment per card
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
