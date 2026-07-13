-- Add UNIQUE constraint on user_id so upsert with onConflict: "user_id" works
-- This ensures one profile row per Supabase auth user (stable UUID, unlike GitHub username)

-- First, clean up any duplicate rows that may have been created by the prior
-- username-keyed upsert bug (keep the row with the most recent updated_at)
DELETE FROM profiles
WHERE user_id IN (
  SELECT user_id FROM profiles
  GROUP BY user_id HAVING COUNT(*) > 1
)
AND user_id IS NOT NULL
AND id NOT IN (
  SELECT id FROM profiles p2
  WHERE p2.user_id = profiles.user_id
  ORDER BY updated_at DESC
  LIMIT 1
);

ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
