-- DevMon Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Profiles cache: stores fetched GitHub stats and generated card data
-- TTL: 24 hours (update on re-fetch)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,                -- GitHub username (login)
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  stats JSONB,                        -- Raw GitHub stats (cached)
  card JSONB,                         -- Generated card data
  company TEXT,                       -- Extracted for leaderboard filtering
  primary_language TEXT,              -- Top language for leaderboard filtering
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Card count tracking for landing page counter
CREATE TABLE IF NOT EXISTS card_count (
  id INTEGER PRIMARY KEY DEFAULT 1,
  count INTEGER NOT NULL DEFAULT 0
);

-- Insert initial count row
INSERT INTO card_count (id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Leaderboard: stores generated cards for public ranking
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
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

-- Index for leaderboard sorting
CREATE INDEX IF NOT EXISTS idx_leaderboard_rarity_score ON leaderboard (rarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_company ON leaderboard (company);
CREATE INDEX IF NOT EXISTS idx_leaderboard_primary_language ON leaderboard (primary_language);

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles (updated_at);
