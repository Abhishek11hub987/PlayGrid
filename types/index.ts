// PlayGrid — Shared TypeScript types

export type SystemRole = 'super_admin' | 'publisher' | 'player'
export type OrgRole = 'owner' | 'admin' | 'staff' | 'viewer'
export type OrgStatus = 'pending' | 'active' | 'suspended' | 'rejected'
export type PortalStatus = 'draft' | 'published' | 'paused' | 'archived'
export type GameApprovalStatus = 'pending' | 'approved' | 'rejected'
export type AdFormat = 'banner' | 'responsive' | 'interstitial' | 'rewarded_video'
export type RevenueStatus = 'estimated' | 'verified' | 'paid' | 'voided'
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing'
export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export interface Profile {
  id: string
  username?: string
  display_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  system_role: SystemRole
  is_banned: boolean
  ban_reason?: string
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  owner_id: string
  plan_id?: string
  logo_url?: string
  website?: string
  description?: string
  status: OrgStatus
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  slug: string
  description?: string
  price_monthly: number
  price_yearly: number
  max_portals: number
  max_team_members: number
  max_games_per_portal: number
  features: string[]
  is_active: boolean
}

export interface Portal {
  id: string
  organization_id: string
  name: string
  slug: string
  tagline?: string
  description?: string
  logo_url?: string
  favicon_url?: string
  status: PortalStatus
  custom_domain?: string
  domain_verified: boolean
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  metadata: Record<string, unknown>
  deleted_at?: string
  created_at: string
  updated_at: string
  // joined
  theme?: PortalTheme
  sections?: PortalSection[]
}

export interface PortalTheme {
  id: string
  portal_id: string
  preset: string
  primary_color: string
  accent_color: string
  background_type: string
  font_preset: string
  custom_css?: string
}

export interface PortalSection {
  id: string
  portal_id: string
  section_key: string
  is_enabled: boolean
  sort_order: number
  config: Record<string, unknown>
}

export interface GameCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  sort_order: number
  is_active: boolean
}

export interface Game {
  id: string
  title: string
  slug: string
  description?: string
  short_description?: string
  thumbnail_url?: string
  banner_url?: string
  category_id?: string
  developer?: string
  developer_url?: string
  game_url?: string
  game_type: 'iframe' | 'storage' | 'sdk'
  technology: 'html5' | 'phaser' | 'unity_webgl' | 'other'
  orientation: 'portrait' | 'landscape' | 'both'
  supported_devices: string[]
  instructions?: string
  controls?: string
  tags: string[]
  approval_status: GameApprovalStatus
  is_active: boolean
  is_featured: boolean
  play_count: number
  rating_average: number
  rating_count: number
  license_type: string
  iframe_sandbox_allow: string
  metadata: Record<string, unknown>
  deleted_at?: string
  created_at: string
  updated_at: string
  // joined
  category?: GameCategory
}

export interface PortalGame {
  id: string
  portal_id: string
  game_id: string
  is_featured: boolean
  is_enabled: boolean
  sort_order: number
  added_at: string
  game?: Game
}

export interface AdProvider {
  id: string
  name: string
  slug: string
  type: 'display' | 'video' | 'native' | 'demo'
  config_schema: Record<string, unknown>
  is_active: boolean
}

export interface AdPlacement {
  id: string
  portal_id: string
  organization_id: string
  provider_id?: string
  name: string
  placement_key: string
  ad_format: AdFormat
  is_enabled: boolean
  frequency_cap: number
  provider_config: Record<string, unknown>
  created_at: string
  updated_at: string
  provider?: AdProvider
}

export interface RevenueRecord {
  id: string
  organization_id: string
  portal_id?: string
  record_type: 'ad_revenue' | 'subscription' | 'adjustment'
  gross_amount: number
  platform_share: number
  publisher_share: number
  currency: string
  period_start?: string
  period_end?: string
  status: RevenueStatus
  is_demo: boolean
  notes?: string
  created_at: string
}

export interface AuditLog {
  id: string
  actor_id?: string
  actor_role?: string
  action: string
  resource_type: string
  resource_id?: string
  organization_id?: string
  portal_id?: string
  metadata: Record<string, unknown>
  ip_address?: string
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  portal_id?: string
  game_id?: string
  user_id?: string
  session_token: string
  device_type?: string
  country_code?: string
  referrer?: string
  metadata: Record<string, unknown>
  created_at: string
}

// Analytics aggregation types
export interface AnalyticsSummary {
  total_visits: number
  unique_visitors: number
  total_plays: number
  avg_session_duration: number
  ad_impressions: number
  estimated_revenue: number
  top_games: { game_id: string; title: string; plays: number }[]
  visits_over_time: { date: string; visits: number; plays: number }[]
  device_breakdown: { device: string; count: number; percentage: number }[]
}

// Nav/UI types
export interface NavItem {
  label: string
  href: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
}

