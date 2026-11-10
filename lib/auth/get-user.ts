import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Profile, SystemRole } from '@/types'

export interface AuthUser {
  id: string
  email?: string
  profile: Profile | null
  systemRole: SystemRole
  isSuperAdmin: boolean
}

/**
 * Returns true only when serving directly on local localhost outside Vercel.
 * Prevents demo/admin fallback from ever activating on deployed public hosts.
 */
export async function isLocalhostRequest(): Promise<boolean> {
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return false
  }
  try {
    const headerList = await headers()
    const host = (headerList.get('x-forwarded-host') || headerList.get('host') || '').toLowerCase()
    return (
      host === 'localhost' ||
      host.startsWith('localhost:') ||
      host === '127.0.0.1' ||
      host.startsWith('127.0.0.1:')
    )
  } catch {
    return false
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    const user = data?.user

    if (!error && user && user.id !== 'user-super-admin') {
      let profile: Profile | null = null
      try {
        const adminClient = createAdminClient()
        const { data: adminProfile } = await adminClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        profile = adminProfile
      } catch {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        profile = userProfile
      }

      if (profile?.is_banned) {
        return null
      }

      const envSuperAdminId = process.env.SUPER_ADMIN_USER_ID
      const isEnvSuperAdmin = Boolean(envSuperAdminId && user.id === envSuperAdminId)
      const systemRole: SystemRole = isEnvSuperAdmin
        ? 'super_admin'
        : (profile?.system_role ?? 'player')
      const isSuperAdmin = systemRole === 'super_admin'

      return { id: user.id, email: user.email, profile, systemRole, isSuperAdmin }
    }

    // Strictly refuse unauthenticated access on deployed/non-localhost environments
    const isLocalhost = await isLocalhostRequest()
    if (!isLocalhost) {
      return null
    }

    const fallbackAdminId = process.env.SUPER_ADMIN_USER_ID || 'user-super-admin'
    const fallbackAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@playgrid.io'
    const fallbackAdminName = process.env.DEFAULT_ADMIN_NAME || 'Studio Admin'

    // Localhost convenience: load real super admin profile from Supabase when available
    try {
      const adminClient = createAdminClient()
      const { data: superAdminProfile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('system_role', 'super_admin')
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (superAdminProfile) {
        return {
          id: superAdminProfile.id,
          email: fallbackAdminEmail,
          profile: superAdminProfile,
          systemRole: 'super_admin',
          isSuperAdmin: true,
        }
      }
    } catch (e) {
      console.warn('Could not fetch super admin profile from Supabase:', e)
    }

    return {
      id: fallbackAdminId,
      email: fallbackAdminEmail,
      profile: {
        id: fallbackAdminId,
        username: 'admin',
        display_name: fallbackAdminName,
        system_role: 'super_admin',
        is_banned: false,
        created_at: '2026-03-01T00:00:00Z',
        updated_at: '2026-03-01T00:00:00Z',
      },
      systemRole: 'super_admin',
      isSuperAdmin: true,
    }
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getAuthUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireSuperAdmin() {
  const user = await requireAuth()
  if (!user.isSuperAdmin) throw new Error('Forbidden: super admin only')
  return user
}

/**
 * Verifies whether the user is a super admin or an authorized member/owner of the portal's organization.
 */
export async function canManagePortal(
  user: AuthUser,
  portalId: string
): Promise<{ allowed: boolean; exists: boolean }> {
  if (user.isSuperAdmin) {
    return { allowed: true, exists: true }
  }

  try {
    const adminClient = createAdminClient()
    const { data: portal } = await adminClient
      .from('portals')
      .select('id, organization_id')
      .eq('id', portalId)
      .is('deleted_at', null)
      .single()

    if (!portal) {
      return { allowed: false, exists: false }
    }

    const { data: member } = await adminClient
      .from('organization_members')
      .select('role')
      .eq('organization_id', portal.organization_id)
      .eq('user_id', user.id)
      .single()

    if (member && ['owner', 'admin', 'staff'].includes(member.role)) {
      return { allowed: true, exists: true }
    }

    const { data: org } = await adminClient
      .from('organizations')
      .select('owner_id')
      .eq('id', portal.organization_id)
      .single()

    return { allowed: org?.owner_id === user.id, exists: true }
  } catch {
    return { allowed: false, exists: false }
  }
}

export async function requirePortalAccess(
  portalId: string
): Promise<{ ok: true; user: AuthUser } | { ok: false; status: 401 | 403 | 404; error: string }> {
  const user = await getAuthUser()
  if (!user) {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  const access = await canManagePortal(user, portalId)
  if (!access.exists) {
    return { ok: false, status: 404, error: 'Portal not found' }
  }
  if (!access.allowed) {
    return { ok: false, status: 403, error: 'Forbidden' }
  }

  return { ok: true, user }
}

export async function getUserOrgRole(organizationId: string): Promise<string | null> {
  const user = await getAuthUser()
  if (!user) return null
  if (user.isSuperAdmin) return 'owner'

  const adminClient = createAdminClient()
  const { data } = await adminClient
    .from('organization_members')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single()

  return data?.role ?? null
}
