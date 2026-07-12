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
