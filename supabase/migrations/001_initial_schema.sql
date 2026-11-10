-- ============================================================
-- PlayGrid Database Schema
-- PostgreSQL / Supabase
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PLANS
-- ============================================================
CREATE TABLE plans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,                    -- FREE, STARTER, PRO, ENTERPRISE
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly NUMERIC(10,2) DEFAULT 0,
  price_yearly  NUMERIC(10,2) DEFAULT 0,
  max_portals   INT DEFAULT 1,
  max_team_members INT DEFAULT 1,
  max_games_per_portal INT DEFAULT 50,
  features    JSONB DEFAULT '[]',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  website       TEXT,
  system_role   TEXT NOT NULL DEFAULT 'player'
                CHECK (system_role IN ('super_admin','publisher','player')),
  is_banned     BOOLEAN DEFAULT FALSE,
  ban_reason    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORGANIZATIONS (publisher accounts)
-- ============================================================
CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  owner_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  plan_id       UUID REFERENCES plans(id),
  logo_url      TEXT,
  website       TEXT,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','active','suspended','rejected')),
  rejection_reason TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_owner ON organizations(owner_id);
CREATE INDEX idx_organizations_status ON organizations(status);

-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================
CREATE TABLE organization_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'staff'
                  CHECK (role IN ('owner','admin','staff','viewer')),
  permissions     JSONB DEFAULT '{}',
  invited_by      UUID REFERENCES auth.users(id),
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id         UUID NOT NULL REFERENCES plans(id),
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','cancelled','past_due','trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  external_id     TEXT,                         -- payment provider subscription ID
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GAME CATEGORIES
-- ============================================================
CREATE TABLE game_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GAMES
-- ============================================================
CREATE TABLE games (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  description          TEXT,
  short_description    TEXT,
  thumbnail_url        TEXT,
  banner_url           TEXT,
  category_id          UUID REFERENCES game_categories(id),
  developer            TEXT,
  developer_url        TEXT,
  game_url             TEXT,                    -- hosted URL or storage path
  game_type            TEXT DEFAULT 'iframe'
                       CHECK (game_type IN ('iframe','storage','sdk')),
  technology           TEXT DEFAULT 'html5'
                       CHECK (technology IN ('html5','phaser','unity_webgl','other')),
  orientation          TEXT DEFAULT 'both'
                       CHECK (orientation IN ('portrait','landscape','both')),
  supported_devices    TEXT[] DEFAULT ARRAY['desktop','tablet','mobile'],
  instructions         TEXT,
  controls             TEXT,
  tags                 TEXT[] DEFAULT ARRAY[]::TEXT[],
  approval_status      TEXT NOT NULL DEFAULT 'pending'
                       CHECK (approval_status IN ('pending','approved','rejected')),
  rejection_reason     TEXT,
  is_active            BOOLEAN DEFAULT FALSE,
  is_featured          BOOLEAN DEFAULT FALSE,
  play_count           BIGINT DEFAULT 0,
  rating_average       NUMERIC(3,2) DEFAULT 0,
  rating_count         INT DEFAULT 0,
  license_type         TEXT DEFAULT 'licensed',
  license_notes        TEXT,
  distribution_notes   TEXT,
  iframe_sandbox_allow TEXT DEFAULT 'allow-scripts allow-same-origin allow-fullscreen',
  allowed_origins      TEXT[],
  metadata             JSONB DEFAULT '{}',
  deleted_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_games_category ON games(category_id);
CREATE INDEX idx_games_status ON games(approval_status, is_active);
CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_play_count ON games(play_count DESC);

-- ============================================================
-- GAME PERMISSIONS (which orgs can distribute which games)
-- ============================================================
CREATE TABLE game_permissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = all orgs
  permission_type TEXT NOT NULL DEFAULT 'display'
                  CHECK (permission_type IN ('display','embed','download')),
  granted_by      UUID REFERENCES auth.users(id),
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PORTALS
-- ============================================================
CREATE TABLE portals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  tagline         TEXT,
  description     TEXT,
  logo_url        TEXT,
  favicon_url     TEXT,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','published','paused','archived')),
  custom_domain   TEXT UNIQUE,
  domain_verified BOOLEAN DEFAULT FALSE,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  metadata        JSONB DEFAULT '{}',
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portals_org ON portals(organization_id);
CREATE INDEX idx_portals_slug ON portals(slug);
CREATE INDEX idx_portals_domain ON portals(custom_domain);

-- ============================================================
-- PORTAL DOMAINS
-- ============================================================
CREATE TABLE portal_domains (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id   UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  domain      TEXT NOT NULL UNIQUE,
  is_primary  BOOLEAN DEFAULT FALSE,
  verified    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PORTAL THEMES
-- ============================================================
CREATE TABLE portal_themes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id       UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  preset          TEXT DEFAULT 'dark-gaming',
  primary_color   TEXT DEFAULT '#6720ff',
  accent_color    TEXT DEFAULT '#0ea5e9',
  background_type TEXT DEFAULT 'dark',
  font_preset     TEXT DEFAULT 'geist',
  custom_css      TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portal_id)
);

-- ============================================================
-- PORTAL SECTIONS (homepage layout config)
-- ============================================================
CREATE TABLE portal_sections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id   UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,                    -- hero, trending, categories, etc.
  is_enabled  BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  config      JSONB DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portal_id, section_key)
);

-- ============================================================
-- PORTAL GAMES
-- ============================================================
CREATE TABLE portal_games (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id   UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  game_id     UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_enabled  BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  added_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portal_id, game_id)
);

CREATE INDEX idx_portal_games_portal ON portal_games(portal_id);
CREATE INDEX idx_portal_games_game   ON portal_games(game_id);

-- ============================================================
-- GAME SESSIONS
-- ============================================================
CREATE TABLE game_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  portal_id       UUID REFERENCES portals(id) ON DELETE SET NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token   TEXT NOT NULL,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  duration_seconds INT,
  completed       BOOLEAN DEFAULT FALSE,
  device_type     TEXT,
  country_code    TEXT,
  metadata        JSONB DEFAULT '{}'
);

CREATE INDEX idx_game_sessions_game   ON game_sessions(game_id);
CREATE INDEX idx_game_sessions_portal ON game_sessions(portal_id);
CREATE INDEX idx_game_sessions_user   ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_date   ON game_sessions(started_at);

-- ============================================================
-- PLAYER FAVORITES
-- ============================================================
CREATE TABLE player_favorites (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id    UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- ============================================================
-- PLAYER HISTORY
-- ============================================================
CREATE TABLE player_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  played_at       TIMESTAMPTZ DEFAULT NOW(),
  play_duration_s INT
);

CREATE INDEX idx_player_history_user ON player_history(user_id);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE achievements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  points      INT DEFAULT 0,
  condition   JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player_achievements (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================
-- LEADERBOARD SCORES
-- ============================================================
CREATE TABLE leaderboard_scores (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score           BIGINT NOT NULL,
  score_hash      TEXT,                         -- server-side validation hash
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  period          TEXT DEFAULT 'alltime'
                  CHECK (period IN ('daily','weekly','alltime')),
  metadata        JSONB DEFAULT '{}'
);

CREATE INDEX idx_leaderboard_game   ON leaderboard_scores(game_id, period, score DESC);
CREATE INDEX idx_leaderboard_user   ON leaderboard_scores(user_id);

-- ============================================================
-- AD PROVIDERS
-- ============================================================
CREATE TABLE ad_providers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  type          TEXT DEFAULT 'display'
                CHECK (type IN ('display','video','native','demo')),
  config_schema JSONB DEFAULT '{}',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AD PLACEMENTS
-- ============================================================
CREATE TABLE ad_placements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_id       UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider_id     UUID REFERENCES ad_providers(id),
  name            TEXT NOT NULL,
  placement_key   TEXT NOT NULL,                -- homepage_banner, game_detail_top, etc.
  ad_format       TEXT NOT NULL DEFAULT 'banner'
                  CHECK (ad_format IN ('banner','responsive','interstitial','rewarded_video')),
  is_enabled      BOOLEAN DEFAULT TRUE,
  frequency_cap   INT DEFAULT 0,
  provider_config JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AD EVENTS
-- ============================================================
CREATE TABLE ad_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  placement_id    UUID NOT NULL REFERENCES ad_placements(id) ON DELETE CASCADE,
  portal_id       UUID NOT NULL REFERENCES portals(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL CHECK (event_type IN ('impression','click','view')),
  game_id         UUID REFERENCES games(id),
  session_token   TEXT,
  country_code    TEXT,
  device_type     TEXT,
  revenue_amount  NUMERIC(12,6) DEFAULT 0,
  currency        TEXT DEFAULT 'USD',
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ad_events_placement ON ad_events(placement_id);
CREATE INDEX idx_ad_events_portal    ON ad_events(portal_id);
CREATE INDEX idx_ad_events_date      ON ad_events(created_at);

-- ============================================================
-- REVENUE RECORDS
-- ============================================================
CREATE TABLE revenue_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  portal_id       UUID REFERENCES portals(id) ON DELETE SET NULL,
  record_type     TEXT NOT NULL CHECK (record_type IN ('ad_revenue','subscription','adjustment')),
  gross_amount    NUMERIC(12,4) NOT NULL DEFAULT 0,
  platform_share  NUMERIC(12,4) DEFAULT 0,
  publisher_share NUMERIC(12,4) DEFAULT 0,
  currency        TEXT DEFAULT 'USD',
  period_start    TIMESTAMPTZ,
  period_end      TIMESTAMPTZ,
  status          TEXT DEFAULT 'estimated'
                  CHECK (status IN ('estimated','verified','paid','voided')),
  is_demo         BOOLEAN DEFAULT FALSE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revenue_org    ON revenue_records(organization_id);
CREATE INDEX idx_revenue_status ON revenue_records(status);

-- ============================================================
-- PUBLISHER PAYOUTS
-- ============================================================
CREATE TABLE publisher_payouts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  amount          NUMERIC(12,4) NOT NULL,
  currency        TEXT DEFAULT 'USD',
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','processing','paid','failed','cancelled')),
  method          TEXT,
  external_ref    TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  paid_at         TIMESTAMPTZ
);

-- ============================================================
-- ANALYTICS EVENTS
-- ============================================================
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type      TEXT NOT NULL,                -- portal_view, game_start, game_complete, etc.
  portal_id       UUID REFERENCES portals(id) ON DELETE SET NULL,
  game_id         UUID REFERENCES games(id) ON DELETE SET NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token   TEXT NOT NULL,
  device_type     TEXT,
  country_code    TEXT,
  referrer        TEXT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_portal ON analytics_events(portal_id, created_at);
CREATE INDEX idx_analytics_game   ON analytics_events(game_id, created_at);
CREATE INDEX idx_analytics_type   ON analytics_events(event_type, created_at);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE support_tickets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  subject         TEXT NOT NULL,
  message         TEXT NOT NULL,
  status          TEXT DEFAULT 'open'
                  CHECK (status IN ('open','in_progress','resolved','closed')),
  priority        TEXT DEFAULT 'normal'
                  CHECK (priority IN ('low','normal','high','urgent')),
  assigned_to     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODERATION REPORTS
-- ============================================================
CREATE TABLE moderation_reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type     TEXT NOT NULL CHECK (target_type IN ('game','portal','user','comment')),
  target_id       UUID NOT NULL,
  reason          TEXT NOT NULL,
  details         TEXT,
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','reviewed','actioned','dismissed')),
  reviewed_by     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role      TEXT,
  action          TEXT NOT NULL,
  resource_type   TEXT NOT NULL,
  resource_id     UUID,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  portal_id       UUID REFERENCES portals(id) ON DELETE SET NULL,
  metadata        JSONB DEFAULT '{}',
  ip_address      TEXT,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_actor    ON audit_logs(actor_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_date     ON audit_logs(created_at DESC);

-- ============================================================
-- CONSENT RECORDS
-- ============================================================
CREATE TABLE consent_records (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token   TEXT,
  consent_type    TEXT NOT NULL,
  granted         BOOLEAN NOT NULL,
  version         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on tenant tables
ALTER TABLE organizations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE portals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_themes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_sections    ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_games       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_records    ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_payouts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_favorites   ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;

-- profiles: users see own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- organizations: owners and members can see their own orgs
CREATE POLICY "Org members can view their organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Org owners can update their organization"
  ON organizations FOR UPDATE
  USING (owner_id = auth.uid());

-- portals: org members can view portals in their org
CREATE POLICY "Org members can view portals"
  ON portals FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Public can view published portals
CREATE POLICY "Public can view published portals"
  ON portals FOR SELECT
  USING (status = 'published' AND deleted_at IS NULL);

-- portal_games: org members can view
CREATE POLICY "Org members can view portal games"
  ON portal_games FOR SELECT
  USING (
    portal_id IN (
      SELECT p.id FROM portals p
      JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

-- player_favorites: users see own
CREATE POLICY "Users see own favorites"
  ON player_favorites FOR ALL
  USING (user_id = auth.uid());

-- player_history: users see own
CREATE POLICY "Users see own history"
  ON player_history FOR ALL
  USING (user_id = auth.uid());

-- player_achievements: users see own
CREATE POLICY "Users see own achievements"
  ON player_achievements FOR ALL
  USING (user_id = auth.uid());

-- revenue_records: org members can view own revenue
CREATE POLICY "Org members view own revenue"
  ON revenue_records FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- ad_events: org members can view own events
CREATE POLICY "Org members view own ad events"
  ON ad_events FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGERS: updated_at auto-update
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_portals_updated_at
  BEFORE UPDATE ON portals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_games_updated_at
  BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_plans_updated_at
  BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, system_role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)), 'player');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

