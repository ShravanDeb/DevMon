-- ============================================================
-- 002_reset_and_fix_edition.sql
-- Run this in Supabase SQL Editor to:
--   1. Delete all existing card data (fresh start)
--   2. Fix the upsert_card function so edition uses the DB sequence
--   3. Reset the edition counter to 1
-- ============================================================

-- 1. Delete all card data
DELETE FROM cards;

-- 2. Reset the edition sequence to 1
ALTER SEQUENCE card_edition_seq RESTART WITH 1;

-- 3. Fix the upsert_card function: treat edition=0 as "use sequence"
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
    p_card_id,
    CASE WHEN p_edition IS NULL OR p_edition = 0 THEN nextval('card_edition_seq') ELSE p_edition END,
    p_raw_stats, p_stats, p_rarity, p_rarity_score, p_primary_class, p_secondary_class,
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
