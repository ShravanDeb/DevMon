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
