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
