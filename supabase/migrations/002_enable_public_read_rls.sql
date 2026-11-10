-- ============================================================
-- PlayGrid RLS Policies for Public Discovery & Games
-- Run this in Supabase SQL Editor to allow anonymous visitors
-- to view approved games, categories, and published portals.
-- ============================================================

-- 1. Enable RLS on games & allow public reads for approved games
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved games" ON games;
CREATE POLICY "Public can view approved games"
  ON games FOR SELECT
  USING (approval_status = 'approved' AND is_active = true AND deleted_at IS NULL);

-- 2. Enable RLS on game_categories & allow public reads
ALTER TABLE game_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active categories" ON game_categories;
CREATE POLICY "Public can view active categories"
  ON game_categories FOR SELECT
  USING (is_active = true);

-- 3. Enable RLS on plans & allow public reads
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active plans" ON plans;
CREATE POLICY "Public can view active plans"
  ON plans FOR SELECT
  USING (is_active = true);

-- 4. Enable RLS on ad_providers & allow public reads
ALTER TABLE ad_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active ad providers" ON ad_providers;
CREATE POLICY "Public can view active ad providers"
  ON ad_providers FOR SELECT
  USING (is_active = true);

-- 5. Leaderboard scores - public read
DROP POLICY IF EXISTS "Public can view leaderboard scores" ON leaderboard_scores;
CREATE POLICY "Public can view leaderboard scores"
  ON leaderboard_scores FOR SELECT
  USING (true);

