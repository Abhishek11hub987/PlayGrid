import { createAdminClient } from '@/lib/supabase/admin'
import type { Portal } from '@/types'

/**
 * Resolve the current portal from the request hostname.
 * Supports:
 *   playgrid.com/portal/[slug]  -> resolved via slug param
 *   [slug].playgrid.com         -> resolved via subdomain
 *   custom-domain.com           -> resolved via portal_domains table
 */
export async function resolvePortalBySlug(slug: string): Promise<Portal | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('portals')
      .select('*, theme:portal_themes(*), sections:portal_sections(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .single()
    return data as Portal | null
  } catch {
    return null
  }
}

export async function resolvePortalByDomain(domain: string): Promise<Portal | null> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('portal_domains')
      .select('portal_id')
      .eq('domain', domain)
      .eq('verified', true)
      .single()
    if (!data) return null

    const { data: portal } = await supabase
      .from('portals')
      .select('*, theme:portal_themes(*), sections:portal_sections(*)')
      .eq('id', data.portal_id)
      .eq('status', 'published')
      .is('deleted_at', null)
      .single()
    return portal as Portal | null
  } catch {
    return null
  }
}
