-- ============================================================
-- full_migration.sql — single migration, run against a clean database
-- Consolidated from 001_init.sql + 002_upsert_fix.sql
-- ============================================================

-- Drop old tables if they exist (from previous schema)
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS leaderboard CASCADE;
DROP TABLE IF EXISTS editions CASCADE;
DROP TABLE IF EXISTS card_count CASCADE;

-- Drop old functions
DROP FUNCTION IF EXISTS increment_card_count() CASCADE;
DROP FUNCTION IF EXISTS increment_edition(p_card_id TEXT) CASCADE;
DROP FUNCTION IF EXISTS upsert_card() CASCADE;

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

-- Atomic upsert v2: SELECT FOR UPDATE with row-level locking
-- Preserves card_id, edition, created_at on update.
CREATE OR REPLACE FUNCTION upsert_card_v2(
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
DECLARE
  existing_row cards%ROWTYPE;
  real_edition INTEGER;
  real_card_id TEXT;
BEGIN
  -- Lock the row if it exists (blocks concurrent writes)
  SELECT * INTO existing_row
  FROM cards
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF FOUND THEN
    -- Preserve existing card_id and edition
    real_card_id := existing_row.card_id;
    real_edition := existing_row.edition;

    RETURN QUERY
    UPDATE cards SET
      github_username = p_github_username,
      username = p_username,
      display_name = p_display_name,
      avatar_url = p_avatar_url,
      company = p_company,
      primary_language = p_primary_language,
      raw_stats = p_raw_stats,
      stats = p_stats,
      rarity = p_rarity,
      rarity_score = p_rarity_score,
      primary_class = p_primary_class,
      secondary_class = p_secondary_class,
      hero_stat = p_hero_stat,
      signature_move = p_signature_move,
      achievements = p_achievements,
      flavor_text = p_flavor_text,
      flavor_tone = p_flavor_tone,
      sha256_hash = p_sha256_hash,
      digital_signature = p_digital_signature,
      version = p_version,
      updated_at = now()
    WHERE user_id = p_user_id
    RETURNING *;
  ELSE
    -- Determine edition for new row
    IF p_edition IS NULL OR p_edition = 0 THEN
      real_edition := nextval('card_edition_seq');
    ELSE
      real_edition := p_edition;
    END IF;
    real_card_id := p_card_id;

    RETURN QUERY
    INSERT INTO cards (
      user_id, github_username, username, display_name, avatar_url, company, primary_language,
      card_id, edition, raw_stats, stats, rarity, rarity_score, primary_class, secondary_class,
      hero_stat, signature_move, achievements, flavor_text, flavor_tone,
      sha256_hash, digital_signature, version, updated_at
    ) VALUES (
      p_user_id, p_github_username, p_username, p_display_name, p_avatar_url, p_company, p_primary_language,
      real_card_id, real_edition,
      p_raw_stats, p_stats, p_rarity, p_rarity_score, p_primary_class, p_secondary_class,
      p_hero_stat, p_signature_move, p_achievements, p_flavor_text, p_flavor_tone,
      p_sha256_hash, p_digital_signature, p_version, now()
    )
    RETURNING *;
  END IF;
END;
$$;
