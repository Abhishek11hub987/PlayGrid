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

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    const user = data?.user

    if (!error && user && user.id !== 'user-super-admin') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const systemRole: SystemRole = profile?.system_role ?? 'player'
      const isSuperAdmin = systemRole === 'super_admin'

      return { id: user.id, email: user.email, profile, systemRole, isSuperAdmin }
    }

    const fallbackAdminId = process.env.SUPER_ADMIN_USER_ID || 'user-super-admin'
    const fallbackAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@playgrid.io'
    const fallbackAdminName = process.env.DEFAULT_ADMIN_NAME || 'Studio Admin'

    // Try to load real super admin profile from live Supabase
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

    // Default local/demo admin fallback
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

export async function getUserOrgRole(organizationId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 'owner'

  const { data } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single()

  return data?.role ?? 'owner'
}
