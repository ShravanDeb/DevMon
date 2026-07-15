-- ============================================================
-- 001_init.sql — single migration, run against a clean database
-- ============================================================

-- Drop old tables if they exist (from previous schema)
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS editions CASCADE;
DROP TABLE IF EXISTS card_count CASCADE;

-- Drop old functions
DROP FUNCTION IF EXISTS increment_card_count() CASCADE;
DROP FUNCTION IF EXISTS increment_edition(p_card_id TEXT) CASCADE;

-- Atomic, gapless-enough edition counter
CREATE SEQUENCE IF NOT EXISTS card_edition_seq START WITH 1;

CREATE TABLE cards (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username     TEXT NOT NULL,
  username            TEXT,
  display_name        TEXT,
  avatar_url          TEXT,
  company             TEXT,
  primary_language    TEXT,
  card_id             TEXT NOT NULL UNIQUE,
  edition             INTEGER NOT NULL UNIQUE DEFAULT nextval('card_edition_seq'),
  raw_stats           JSONB NOT NULL,
  stats               JSONB NOT NULL,
  rarity              TEXT NOT NULL,
  rarity_score        INTEGER NOT NULL,
  primary_class       TEXT NOT NULL,
  secondary_class     TEXT,
  hero_stat           JSONB NOT NULL,
  signature_move      JSONB NOT NULL,
  achievements        JSONB NOT NULL,
  flavor_text         TEXT NOT NULL,
  flavor_tone         TEXT NOT NULL DEFAULT 'hype',
  sha256_hash         TEXT NOT NULL,
  digital_signature   TEXT NOT NULL,
  verification_version TEXT NOT NULL DEFAULT 'v1',
  version             TEXT,
  rank                INTEGER,
  total_cards         INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_cards_card_id ON cards (card_id);
CREATE INDEX idx_cards_rarity_score ON cards (rarity_score DESC);
CREATE INDEX idx_cards_company ON cards (company) WHERE company IS NOT NULL;

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON cards
  FOR SELECT USING (true);

CREATE POLICY "service role full access" ON cards
  FOR ALL USING (auth.role() = 'service_role');

-- Atomic upsert: single INSERT ... ON CONFLICT (user_id) DO UPDATE.
-- Preserves card_id, edition, created_at on update. Returns every column.
CREATE OR REPLACE FUNCTION upsert_card(
  p_user_id UUID,
  p_github_username TEXT,
  p_username TEXT,
  p_display_name TEXT,
  p_avatar_url TEXT,
  p_company TEXT,
  p_primary_language TEXT,
  p_card_id TEXT,
  p_edition INTEGER,
  p_raw_stats JSONB,
  p_stats JSONB,
  p_rarity TEXT,
  p_rarity_score INTEGER,
  p_primary_class TEXT,
  p_secondary_class TEXT,
  p_hero_stat JSONB,
  p_signature_move JSONB,
  p_achievements JSONB,
  p_flavor_text TEXT,
  p_flavor_tone TEXT,
  p_sha256_hash TEXT,
  p_digital_signature TEXT,
  p_version TEXT
)
RETURNS SETOF cards
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO cards (
    user_id, github_username, username, display_name, avatar_url, company, primary_language,
    card_id, edition, raw_stats, stats, rarity, rarity_score, primary_class, secondary_class,
    hero_stat, signature_move, achievements, flavor_text, flavor_tone,
    sha256_hash, digital_signature, version, updated_at
  ) VALUES (
    p_user_id, p_github_username, p_username, p_display_name, p_avatar_url, p_company, p_primary_language,
    p_card_id, CASE WHEN p_edition IS NULL OR p_edition = 0 THEN nextval('card_edition_seq') ELSE p_edition END, p_raw_stats, p_stats, p_rarity, p_rarity_score, p_primary_class, p_secondary_class,
    p_hero_stat, p_signature_move, p_achievements, p_flavor_text, p_flavor_tone,
    p_sha256_hash, p_digital_signature, p_version, now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    github_username = EXCLUDED.github_username,
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    company = EXCLUDED.company,
    primary_language = EXCLUDED.primary_language,
    raw_stats = EXCLUDED.raw_stats,
    stats = EXCLUDED.stats,
    rarity = EXCLUDED.rarity,
    rarity_score = EXCLUDED.rarity_score,
    primary_class = EXCLUDED.primary_class,
    secondary_class = EXCLUDED.secondary_class,
    hero_stat = EXCLUDED.hero_stat,
    signature_move = EXCLUDED.signature_move,
    achievements = EXCLUDED.achievements,
    flavor_text = EXCLUDED.flavor_text,
    flavor_tone = EXCLUDED.flavor_tone,
    sha256_hash = EXCLUDED.sha256_hash,
    digital_signature = EXCLUDED.digital_signature,
    version = EXCLUDED.version,
    updated_at = now()
  RETURNING *;
END;
$$;
