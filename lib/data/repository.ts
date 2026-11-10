import {
  DEMO_GAMES,
  DEMO_CATEGORIES,
  DEMO_PORTALS,
  DEMO_ORGANIZATIONS,
  DEMO_SUPER_ADMIN_PROFILE,
  DEMO_PUBLISHER_PROFILE,
  DEMO_AD_PLACEMENTS,
  DEMO_REVENUE_RECORDS,
  DEMO_AUDIT_LOGS,
} from './mock-db'
import type { Game, GameCategory, Portal, Organization, Profile, AdPlacement, RevenueRecord, AuditLog, Plan } from '@/types'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Data Repository Layer
 * Acts as an abstraction over Supabase PostgreSQL and local fallback cache.
 * When Supabase credentials exist, it queries live production tables.
 * If tables are empty or unreachable, it seamlessly provides rich mock fixtures.
 */

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && !url.includes('your_supabase') && !url.includes('placeholder'))
}

export const repository = {
  // ============================================================
  // Games
  // ============================================================
  async getGames(options?: {
    categorySlug?: string
    search?: string
    sort?: string
    status?: string
    featuredOnly?: boolean
    limit?: number
    offset?: number
  }): Promise<{ data: Game[]; count: number }> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        let query = supabase
          .from('games')
          .select('*, game_categories(*)', { count: 'exact' })

        if (options?.featuredOnly) {
          query = query.eq('is_featured', true)
        }

        if (options?.status && options.status !== 'all') {
          query = query.eq('approval_status', options.status)
        } else if (!options?.status) {
          query = query.eq('approval_status', 'approved').eq('is_active', true)
        }

        if (options?.sort === 'recent') {
          query = query.order('created_at', { ascending: false })
        } else if (options?.sort === 'rating') {
          query = query.order('rating_average', { ascending: false })
        } else {
          query = query.order('play_count', { ascending: false })
        }

        if (options?.limit) {
          const from = options.offset ?? 0
          const to = from + options.limit - 1
          query = query.range(from, to)
        }

        const { data, count, error } = await query

        if (!error && data && data.length > 0) {
          let games: Game[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            short_description: item.short_description,
            thumbnail_url: item.thumbnail_url || `/thumbnails/${item.slug}.svg`,
            banner_url: item.banner_url || item.thumbnail_url || `/thumbnails/${item.slug}.svg`,
            category_id: item.category_id,
            developer: item.developer || 'PlayGrid Originals',
            developer_url: item.developer_url || 'https://playgrid.io',
            game_url: item.game_url || `/games/${item.slug}/index.html`,
            game_type: item.game_type || 'iframe',
            technology: item.technology || 'html5',
            orientation: item.orientation || 'both',
            supported_devices: item.supported_devices || ['desktop', 'tablet', 'mobile'],
            instructions: item.instructions || 'Use keyboard or touch controls to play.',
            controls: item.controls || 'Keyboard / Touch',
            tags: item.tags || [],
            approval_status: item.approval_status || 'approved',
            is_active: item.is_active ?? true,
            is_featured: item.is_featured ?? false,
            play_count: Number(item.play_count) || 0,
            rating_average: Number(item.rating_average) || 4.8,
            rating_count: Number(item.rating_count) || 120,
            license_type: item.license_type || 'Licensed',
            iframe_sandbox_allow: item.iframe_sandbox_allow || 'allow-scripts allow-same-origin allow-fullscreen',
            metadata: item.metadata || {},
            created_at: item.created_at,
            updated_at: item.updated_at,
            category: item.game_categories ? {
              id: item.game_categories.id,
              name: item.game_categories.name,
              slug: item.game_categories.slug,
              description: item.game_categories.description,
              icon: item.game_categories.icon,
              color: item.game_categories.color,
              sort_order: item.game_categories.sort_order || 0,
              is_active: item.game_categories.is_active ?? true,
            } : undefined
          }))

          if (options?.categorySlug) {
            games = games.filter(g => g.category?.slug === options.categorySlug)
          }

          if (options?.search) {
            const q = options.search.toLowerCase()
            games = games.filter(g =>
              g.title.toLowerCase().includes(q) ||
              g.short_description?.toLowerCase().includes(q) ||
              g.description?.toLowerCase().includes(q) ||
              g.tags.some(t => t.toLowerCase().includes(q))
            )
          }

          return { data: games, count: count ?? games.length }
        }
      }
    } catch (err) {
      console.warn('Repository getGames fallback to demo data:', err)
    }

    // Demo fallback
    let list = [...DEMO_GAMES]
    if (options?.featuredOnly) list = list.filter(g => g.is_featured)
    if (options?.status && options.status !== 'all') {
      list = list.filter(g => g.approval_status === options.status)
    } else if (!options?.status) {
      list = list.filter(g => g.approval_status === 'approved' && g.is_active)
    }

    if (options?.categorySlug) {
      const cat = DEMO_CATEGORIES.find(c => c.slug === options.categorySlug)
      if (cat) list = list.filter(g => g.category_id === cat.id)
    }

    if (options?.search) {
      const q = options.search.toLowerCase()
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.short_description?.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    if (options?.sort === 'recent') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (options?.sort === 'rating') {
      list.sort((a, b) => b.rating_average - a.rating_average)
    } else {
      list.sort((a, b) => b.play_count - a.play_count)
    }

    const total = list.length
    const offset = options?.offset ?? 0
    const limit = options?.limit ?? 50
    return { data: list.slice(offset, offset + limit), count: total }
  },

  async getGameBySlug(slug: string): Promise<Game | null> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('games')
          .select('*, game_categories(*)')
          .eq('slug', slug)
          .single()

        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            slug: data.slug,
            description: data.description,
            short_description: data.short_description,
            thumbnail_url: data.thumbnail_url || `/thumbnails/${data.slug}.svg`,
            banner_url: data.banner_url || data.thumbnail_url || `/thumbnails/${data.slug}.svg`,
            category_id: data.category_id,
            developer: data.developer || 'PlayGrid Originals',
            developer_url: data.developer_url || 'https://playgrid.io',
            game_url: data.game_url || `/games/${data.slug}/index.html`,
            game_type: data.game_type || 'iframe',
            technology: data.technology || 'html5',
            orientation: data.orientation || 'both',
            supported_devices: data.supported_devices || ['desktop', 'tablet', 'mobile'],
            instructions: data.instructions || 'Use keyboard or touch controls to play.',
            controls: data.controls || 'Keyboard / Touch',
            tags: data.tags || [],
            approval_status: data.approval_status || 'approved',
            is_active: data.is_active ?? true,
            is_featured: data.is_featured ?? false,
            play_count: Number(data.play_count) || 0,
            rating_average: Number(data.rating_average) || 4.8,
            rating_count: Number(data.rating_count) || 120,
            license_type: data.license_type || 'Licensed',
            iframe_sandbox_allow: data.iframe_sandbox_allow || 'allow-scripts allow-same-origin allow-fullscreen',
            metadata: data.metadata || {},
            created_at: data.created_at,
            updated_at: data.updated_at,
            category: data.game_categories ? {
              id: data.game_categories.id,
              name: data.game_categories.name,
              slug: data.game_categories.slug,
              description: data.game_categories.description,
              icon: data.game_categories.icon,
              color: data.game_categories.color,
              sort_order: data.game_categories.sort_order || 0,
              is_active: data.game_categories.is_active ?? true,
            } : undefined
          }
        }
      }
    } catch (err) {
      console.warn('Repository getGameBySlug fallback:', err)
    }
    return DEMO_GAMES.find(g => g.slug === slug) ?? null
  },

  async addGame(input: Partial<Game>): Promise<Game> {
    const rawSlug = input.slug || input.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `game-${Date.now()}`
    const slug = rawSlug.toLowerCase().replace(/[^a-z0-9-]+/g, '')
    const id = input.id || `game-${Date.now()}`

    const newGame: Game = {
      id,
      title: input.title || 'Untitled Game',
      slug,
      description: input.description || 'Action-packed HTML5 browser game.',
      short_description: input.short_description || (input.description?.slice(0, 120) ?? 'Action-packed HTML5 game.'),
      thumbnail_url: input.thumbnail_url || 'https://picsum.photos/seed/' + slug + '/600/450',
      banner_url: input.banner_url || input.thumbnail_url || 'https://picsum.photos/seed/' + slug + '/1200/500',
      category_id: input.category_id || 'cat-3',
      developer: input.developer || 'GameDistribution Partner',
      developer_url: input.developer_url || 'https://playgrid.io',
      game_url: input.game_url || '',
      game_type: input.game_type || 'iframe',
      technology: input.technology || 'html5',
      orientation: input.orientation || 'both',
      supported_devices: input.supported_devices || ['desktop', 'tablet', 'mobile'],
      instructions: input.instructions || 'Use mouse or touch controls to play.',
      controls: input.controls || 'Mouse / Touch / Keyboard',
      tags: input.tags || ['html5', 'arcade', 'instant-play'],
      approval_status: input.approval_status || 'approved',
      is_active: input.is_active ?? true,
      is_featured: input.is_featured ?? false,
      play_count: input.play_count ?? 0,
      rating_average: input.rating_average ?? 4.8,
      rating_count: input.rating_count ?? 1,
      license_type: input.license_type || 'Commercial Partner Embed',
      iframe_sandbox_allow: input.iframe_sandbox_allow || 'allow-scripts allow-same-origin allow-fullscreen',
      metadata: input.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: input.category,
    }

    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase.from('games').insert({
          title: newGame.title,
          slug: newGame.slug,
          description: newGame.description,
          short_description: newGame.short_description,
          thumbnail_url: newGame.thumbnail_url,
          banner_url: newGame.banner_url,
          category_id: (input.category_id && input.category_id.length > 10) ? input.category_id : null,
          developer: newGame.developer,
          developer_url: newGame.developer_url,
          game_url: newGame.game_url,
          game_type: newGame.game_type,
          technology: newGame.technology,
          orientation: newGame.orientation,
          supported_devices: newGame.supported_devices,
          instructions: newGame.instructions,
          controls: newGame.controls,
          tags: newGame.tags,
          approval_status: newGame.approval_status,
          is_active: newGame.is_active,
          is_featured: newGame.is_featured,
          play_count: newGame.play_count,
          rating_average: newGame.rating_average,
          rating_count: newGame.rating_count,
          license_type: newGame.license_type,
          iframe_sandbox_allow: newGame.iframe_sandbox_allow,
        }).select().single()

        if (!error && data) {
          newGame.id = data.id
          try {
            const { data: portals } = await supabase.from('portals').select('id')
            if (portals && portals.length > 0) {
              await supabase.from('portal_games').insert(
                portals.map((p: any) => ({
                  portal_id: p.id,
                  game_id: data.id,
                  is_enabled: true
                }))
              )
            }
          } catch (portalErr) {
            console.warn('Could not auto-link portal games:', portalErr)
          }
        }
      }
    } catch (err) {
      console.warn('Repository addGame database insert fallback:', err)
    }

    // Always prepend to memory list so it is immediately visible
    DEMO_GAMES.unshift(newGame)
    return newGame
  },

  // ============================================================
  // Categories
  // ============================================================
  async getCategories(): Promise<GameCategory[]> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('game_categories')
          .select('*')
          .order('sort_order', { ascending: true })

        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            icon: c.icon,
            color: c.color,
            sort_order: c.sort_order || 0,
            is_active: c.is_active ?? true,
          }))
        }
      }
    } catch (err) {
      console.warn('Repository getCategories fallback:', err)
    }
    return [...DEMO_CATEGORIES].sort((a, b) => a.sort_order - b.sort_order)
  },

  async getCategoryBySlug(slug: string): Promise<GameCategory | null> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('game_categories')
          .select('*')
          .eq('slug', slug)
          .single()

        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            color: data.color,
            sort_order: data.sort_order || 0,
            is_active: data.is_active ?? true,
          }
        }
      }
    } catch (err) {
      console.warn('Repository getCategoryBySlug fallback:', err)
    }
    return DEMO_CATEGORIES.find(c => c.slug === slug) ?? null
  },

  // ============================================================
  // Portals
  // ============================================================
  async getPortals(organizationId?: string): Promise<Portal[]> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        let query = supabase
          .from('portals')
          .select('*, portal_themes(*), portal_sections(*)')
          .is('deleted_at', null)

        if (organizationId) {
          query = query.eq('organization_id', organizationId)
        }

        const { data, error } = await query

        if (!error && data && data.length > 0) {
          return data.map((p: any) => {
            const theme = Array.isArray(p.portal_themes) ? p.portal_themes[0] : p.portal_themes
            return {
              id: p.id,
              organization_id: p.organization_id,
              name: p.name,
              slug: p.slug,
              tagline: p.tagline,
              description: p.description,
              logo_url: p.logo_url,
              favicon_url: p.favicon_url,
              status: p.status,
              custom_domain: p.custom_domain,
              domain_verified: p.domain_verified ?? false,
              seo_title: p.seo_title,
              seo_description: p.seo_description,
              seo_keywords: p.seo_keywords || [],
              metadata: p.metadata || {},
              deleted_at: p.deleted_at,
              created_at: p.created_at,
              updated_at: p.updated_at,
              theme: theme ? {
                id: theme.id,
                portal_id: theme.portal_id,
                preset: theme.preset || 'dark-gaming',
                primary_color: theme.primary_color || '#6720ff',
                accent_color: theme.accent_color || '#0ea5e9',
                background_type: theme.background_type || 'dark',
                font_preset: theme.font_preset || 'geist',
                custom_css: theme.custom_css,
              } : undefined,
              sections: Array.isArray(p.portal_sections) ? p.portal_sections.map((s: any) => ({
                id: s.id,
                portal_id: s.portal_id,
                section_key: s.section_key,
                is_enabled: s.is_enabled ?? true,
                sort_order: s.sort_order || 0,
                config: s.config || {},
              })) : []
            }
          })
        }
      }
    } catch (err) {
      console.warn('Repository getPortals fallback:', err)
    }

    if (organizationId) {
      return DEMO_PORTALS.filter(p => p.organization_id === organizationId)
    }
    return DEMO_PORTALS
  },

  async getPortalBySlug(slug: string): Promise<Portal | null> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('portals')
          .select('*, portal_themes(*), portal_sections(*)')
          .eq('slug', slug)
          .single()

        if (!error && data) {
          const theme = Array.isArray(data.portal_themes) ? data.portal_themes[0] : data.portal_themes
          return {
            id: data.id,
            organization_id: data.organization_id,
            name: data.name,
            slug: data.slug,
            tagline: data.tagline,
            description: data.description,
            logo_url: data.logo_url,
            favicon_url: data.favicon_url,
            status: data.status,
            custom_domain: data.custom_domain,
            domain_verified: data.domain_verified ?? false,
            seo_title: data.seo_title,
            seo_description: data.seo_description,
            seo_keywords: data.seo_keywords || [],
            metadata: data.metadata || {},
            created_at: data.created_at,
            updated_at: data.updated_at,
            theme: theme ? {
              id: theme.id,
              portal_id: theme.portal_id,
              preset: theme.preset || 'dark-gaming',
              primary_color: theme.primary_color || '#6720ff',
              accent_color: theme.accent_color || '#0ea5e9',
              background_type: theme.background_type || 'dark',
              font_preset: theme.font_preset || 'geist',
            } : undefined,
            sections: Array.isArray(data.portal_sections) ? data.portal_sections.map((s: any) => ({
              id: s.id,
              portal_id: s.portal_id,
              section_key: s.section_key,
              is_enabled: s.is_enabled ?? true,
              sort_order: s.sort_order || 0,
              config: s.config || {},
            })) : []
          }
        }
      }
    } catch (err) {
      console.warn('Repository getPortalBySlug fallback:', err)
    }
    return DEMO_PORTALS.find(p => p.slug === slug) ?? null
  },

  async getPortalById(id: string): Promise<Portal | null> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('portals')
          .select('*, portal_themes(*), portal_sections(*)')
          .eq('id', id)
          .single()

        if (!error && data) {
          const theme = Array.isArray(data.portal_themes) ? data.portal_themes[0] : data.portal_themes
          return {
            id: data.id,
            organization_id: data.organization_id,
            name: data.name,
            slug: data.slug,
            tagline: data.tagline,
            description: data.description,
            logo_url: data.logo_url,
            favicon_url: data.favicon_url,
            status: data.status,
            custom_domain: data.custom_domain,
            domain_verified: data.domain_verified ?? false,
            seo_title: data.seo_title,
            seo_description: data.seo_description,
            seo_keywords: data.seo_keywords || [],
            metadata: data.metadata || {},
            created_at: data.created_at,
            updated_at: data.updated_at,
            theme: theme ? {
              id: theme.id,
              portal_id: theme.portal_id,
              preset: theme.preset || 'dark-gaming',
              primary_color: theme.primary_color || '#6720ff',
              accent_color: theme.accent_color || '#0ea5e9',
              background_type: theme.background_type || 'dark',
              font_preset: theme.font_preset || 'geist',
            } : undefined,
            sections: Array.isArray(data.portal_sections) ? data.portal_sections.map((s: any) => ({
              id: s.id,
              portal_id: s.portal_id,
              section_key: s.section_key,
              is_enabled: s.is_enabled ?? true,
              sort_order: s.sort_order || 0,
              config: s.config || {},
            })) : []
          }
        }
      }
    } catch (err) {
      console.warn('Repository getPortalById fallback:', err)
    }
    return DEMO_PORTALS.find(p => p.id === id) ?? null
  },

  // ============================================================
  // Organizations / Publishers
  // ============================================================
  async getOrganizations(status?: string): Promise<Organization[]> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        let query = supabase.from('organizations').select('*')
        if (status && status !== 'all') {
          query = query.eq('status', status)
        }
        const { data, error } = await query
        if (!error && data && data.length > 0) {
          return data.map((o: any) => ({
            id: o.id,
            name: o.name,
            slug: o.slug,
            owner_id: o.owner_id,
            plan_id: o.plan_id,
            logo_url: o.logo_url,
            website: o.website,
            description: o.description,
            status: o.status,
            rejection_reason: o.rejection_reason,
            created_at: o.created_at,
            updated_at: o.updated_at,
          }))
        }
      }
    } catch (err) {
      console.warn('Repository getOrganizations fallback:', err)
    }

    if (status && status !== 'all') {
      return DEMO_ORGANIZATIONS.filter(o => o.status === status)
    }
    return DEMO_ORGANIZATIONS
  },

  async getOrganizationById(id: string): Promise<Organization | null> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single()

        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            owner_id: data.owner_id,
            plan_id: data.plan_id,
            logo_url: data.logo_url,
            website: data.website,
            description: data.description,
            status: data.status,
            rejection_reason: data.rejection_reason,
            created_at: data.created_at,
            updated_at: data.updated_at,
          }
        }
      }
    } catch (err) {
      console.warn('Repository getOrganizationById fallback:', err)
    }
    return DEMO_ORGANIZATIONS.find(o => o.id === id) ?? null
  },

  // ============================================================
  // Ad Placements
  // ============================================================
  async getAdPlacements(portalId?: string): Promise<AdPlacement[]> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        let query = supabase.from('ad_placements').select('*')
        if (portalId) {
          query = query.eq('portal_id', portalId)
        }
        const { data, error } = await query
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: a.id,
            portal_id: a.portal_id,
            organization_id: a.organization_id,
            provider_id: a.provider_id,
            name: a.name,
            placement_key: a.placement_key,
            ad_format: a.ad_format,
            is_enabled: a.is_enabled ?? true,
            frequency_cap: a.frequency_cap || 0,
            provider_config: a.provider_config || {},
            created_at: a.created_at,
            updated_at: a.updated_at,
          }))
        }
      }
    } catch (err) {
      console.warn('Repository getAdPlacements fallback:', err)
    }

    if (portalId) {
      return DEMO_AD_PLACEMENTS.filter(a => a.portal_id === portalId)
    }
    return DEMO_AD_PLACEMENTS
  },

  // ============================================================
  // Revenue
  // ============================================================
  async getRevenueRecords(organizationId?: string): Promise<RevenueRecord[]> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        let query = supabase.from('revenue_records').select('*').order('created_at', { ascending: false })
        if (organizationId) {
          query = query.eq('organization_id', organizationId)
        }
        const { data, error } = await query
        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            organization_id: r.organization_id,
            portal_id: r.portal_id,
            record_type: r.record_type,
            gross_amount: Number(r.gross_amount) || 0,
            platform_share: Number(r.platform_share) || 0,
            publisher_share: Number(r.publisher_share) || 0,
            currency: r.currency || 'USD',
            period_start: r.period_start,
            period_end: r.period_end,
            status: r.status,
            is_demo: r.is_demo ?? false,
            notes: r.notes,
            created_at: r.created_at,
          }))
        }
      }
    } catch (err) {
      console.warn('Repository getRevenueRecords fallback:', err)
    }

    if (organizationId) {
      return DEMO_REVENUE_RECORDS.filter(r => r.organization_id === organizationId)
    }
    return DEMO_REVENUE_RECORDS
  },

  // ============================================================
  // Audit Logs
  // ============================================================
  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)

        if (!error && data && data.length > 0) {
          return data.map((l: any) => ({
            id: l.id,
            actor_id: l.actor_id,
            actor_role: l.actor_role,
            action: l.action,
            resource_type: l.resource_type,
            resource_id: l.resource_id,
            organization_id: l.organization_id,
            portal_id: l.portal_id,
            metadata: l.metadata || {},
            ip_address: l.ip_address || '127.0.0.1',
            created_at: l.created_at,
          }))
        }
      }
    } catch (err) {
      console.warn('Repository getAuditLogs fallback:', err)
    }

    return DEMO_AUDIT_LOGS.slice(0, limit)
  },

  // ============================================================
  // Subscription Plans
  // ============================================================
  async getPlans(): Promise<Plan[]> {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .order('price_monthly', { ascending: true })

        if (!error && data && data.length > 0) {
          return data.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price_monthly: Number(p.price_monthly) || 0,
            price_yearly: Number(p.price_yearly) || 0,
            max_portals: p.max_portals || 1,
            max_team_members: p.max_team_members || 1,
            max_games_per_portal: p.max_games_per_portal || 50,
            features: Array.isArray(p.features) ? p.features : [],
            is_active: p.is_active ?? true,
          }))
        }
      }
    } catch (err) {
      console.warn('Repository getPlans fallback:', err)
    }

    return [
      {
        id: 'plan-free',
        name: 'Free Starter',
        slug: 'free',
        description: 'Launch your first indie browser gaming portal with standard ads.',
        price_monthly: 0,
        price_yearly: 0,
        max_portals: 1,
        max_team_members: 1,
        max_games_per_portal: 10,
        features: ['1 White-Label Portal', 'Standard Game Library', 'Network Banner Ads', 'Community Support'],
        is_active: true,
      },
      {
        id: 'plan-starter',
        name: 'Starter Pro',
        slug: 'starter',
        description: 'For gaming creators building an audience and brand presence.',
        price_monthly: 29,
        price_yearly: 290,
        max_portals: 3,
        max_team_members: 3,
        max_games_per_portal: 50,
        features: ['3 Custom Portals', 'Custom Domain Support', 'Priority Ad Placement', '70% Revenue Share', 'Analytics Dashboard'],
        is_active: true,
      },
      {
        id: 'plan-pro',
        name: 'Publisher Pro',
        slug: 'pro',
        description: 'For media studios, gaming channels, and established publishers.',
        price_monthly: 79,
        price_yearly: 790,
        max_portals: 10,
        max_team_members: 10,
        max_games_per_portal: 200,
        features: ['10 White-Label Portals', 'Unlimited Custom Domains', '80% Revenue Share', 'Custom Theme Editor', 'Direct Ad Tag Integration', 'Priority Support'],
        is_active: true,
      },
      {
        id: 'plan-enterprise',
        name: 'Enterprise Network',
        slug: 'enterprise',
        description: 'High-traffic media companies requiring bespoke architecture and direct DSP tags.',
        price_monthly: 299,
        price_yearly: 2990,
        max_portals: 999,
        max_team_members: 50,
        max_games_per_portal: 1000,
        features: ['Unlimited Portals', 'Bespoke SDK Integration', '85% Revenue Share', 'Dedicated Account Manager', 'Custom Game Licensing', 'SLA 99.9% Uptime'],
        is_active: true,
      },
    ]
  },

  // ============================================================
  // User Profile
  // ============================================================
  async getCurrentUserProfile(role: 'player' | 'publisher' | 'super_admin' = 'super_admin'): Promise<Profile> {
    if (role === 'super_admin') return DEMO_SUPER_ADMIN_PROFILE
    if (role === 'publisher') return DEMO_PUBLISHER_PROFILE
    return {
      id: 'demo-player',
      username: 'gamer_pro',
      display_name: 'Gamer Pro',
      system_role: 'player',
      is_banned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
}
