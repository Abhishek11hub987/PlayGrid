-- ============================================================
-- PlayGrid Seed Data
-- For development and demonstration purposes only.
-- All financial and analytics data is DEMO DATA.
-- ============================================================

-- Plans
INSERT INTO plans (name, slug, description, price_monthly, price_yearly, max_portals, max_team_members, max_games_per_portal, features) VALUES
  ('Free',       'free',       'Get started with one portal',           0,      0,      1, 1,  50, '["1 portal","50 games per portal","Basic analytics","PlayGrid branding"]'),
  ('Starter',    'starter',    'Perfect for growing publishers',        29,    290,    3, 3, 100, '["3 portals","100 games per portal","Custom branding","Standard analytics","Email support"]'),
  ('Pro',        'pro',        'For professional gaming networks',      79,    790,    10,10, 500, '["10 portals","500 games per portal","Custom domains","Advanced analytics","Priority support","Team management"]'),
  ('Enterprise', 'enterprise', 'Full-scale gaming infrastructure',     299,  2990,   999,99,9999, '["Unlimited portals","Unlimited games","Dedicated support","Custom integrations","SLA guarantee","White-glove onboarding"]');

-- Game Categories
INSERT INTO game_categories (name, slug, description, icon, color, sort_order) VALUES
  ('Action',       'action',       'Fast-paced action games',              'Zap',         '#ef4444', 1),
  ('Adventure',    'adventure',    'Explore worlds and stories',           'Compass',     '#f97316', 2),
  ('Arcade',       'arcade',       'Classic arcade-style games',           'Gamepad2',    '#eab308', 3),
  ('Puzzle',       'puzzle',       'Brain-teasing puzzle challenges',      'Puzzle',      '#22c55e', 4),
  ('Racing',       'racing',       'High-speed racing games',              'Car',         '#14b8a6', 5),
  ('Sports',       'sports',       'Sports simulation games',              'Trophy',      '#3b82f6', 6),
  ('Strategy',     'strategy',     'Think ahead and conquer',              'Chess',       '#8b5cf6', 7),
  ('Multiplayer',  'multiplayer',  'Play with friends online',             'Users',       '#ec4899', 8),
  ('Casual',       'casual',       'Easy to pick up and play',             'Coffee',      '#06b6d4', 9),
  ('Educational',  'educational',  'Learn while you play',                 'GraduationCap','#84cc16',10);

-- Ad Providers
INSERT INTO ad_providers (name, slug, type, is_active) VALUES
  ('Demo Provider',    'demo',           'demo',    TRUE),
  ('Google AdSense',   'google-adsense', 'display', FALSE),
  ('Media.net',        'media-net',      'display', FALSE),
  ('Unity Ads',        'unity-ads',      'video',   FALSE);

-- Achievements
INSERT INTO achievements (key, name, description, icon, points) VALUES
  ('first_play',      'First Play',       'Play your first game',               'Play',        10),
  ('play_5',          'Getting Warmed Up','Play 5 different games',              'Flame',       25),
  ('play_25',         'Game Explorer',    'Play 25 different games',             'Compass',     50),
  ('play_100',        'Dedicated Gamer',  'Play 100 different games',            'Award',      100),
  ('first_favorite',  'Bookmarked',       'Add your first favorite game',        'Heart',       10),
  ('speed_run',       'Speed Runner',     'Complete a game in under 5 minutes',  'Zap',         30),
  ('leaderboard_top', 'Top of the Board', 'Reach #1 on any leaderboard',        'Trophy',     100),
  ('daily_player',    'Daily Player',     'Log in and play 7 days in a row',     'Calendar',    75);

