import { repository } from '@/lib/data/repository'
import {
  DEMO_GAMES,
  DEMO_CATEGORIES,
  DEMO_PORTALS,
  DEMO_ORGANIZATIONS,
  DEMO_SUPER_ADMIN_PROFILE,
  DEMO_AD_PLACEMENTS,
  DEMO_REVENUE_RECORDS,
  DEMO_AUDIT_LOGS,
} from '@/lib/data/mock-db'

/**
 * Creates a mock Supabase query chain for local development when live PostgreSQL is offline.
 * Implements common chainable methods: .select(), .eq(), .order(), .limit(), .range(), .single()
 */
export function createMockSupabaseClient() {
  return {
    auth: {
      async getUser() {
        return {
          data: {
            user: {
              id: 'user-super-admin',
              email: 'admin@playgrid.io',
              user_metadata: { display_name: 'Platform Super Admin' },
            },
          },
          error: null,
        }
      },
      async getSession() {
        return { data: { session: null }, error: null }
      },
      async signInWithPassword() {
        return { data: { user: { id: 'user-super-admin' } }, error: null }
      },
      async signUp() {
        return { data: { user: { id: 'user-new' } }, error: null }
      },
      async signOut() {
        return { error: null }
      },
    },

    from(table: string) {
      let data: any[] = []
      if (table === 'games') data = [...DEMO_GAMES]
      else if (table === 'game_categories') data = [...DEMO_CATEGORIES]
      else if (table === 'portals') data = [...DEMO_PORTALS]
      else if (table === 'organizations') data = [...DEMO_ORGANIZATIONS]
      else if (table === 'profiles') data = [DEMO_SUPER_ADMIN_PROFILE]
      else if (table === 'ad_placements') data = [...DEMO_AD_PLACEMENTS]
      else if (table === 'revenue_records') data = [...DEMO_REVENUE_RECORDS]
      else if (table === 'audit_logs') data = [...DEMO_AUDIT_LOGS]
      else if (table === 'organization_members') {
        data = [
          { organization_id: 'org-1', user_id: 'user-super-admin', role: 'owner', organization: DEMO_ORGANIZATIONS[0] },
          { organization_id: 'org-1', user_id: 'user-publisher-1', role: 'owner', organization: DEMO_ORGANIZATIONS[0] }
        ]
      }

      let isSingle = false
      let isCountOnly = false

      const builder = {
        select(fields?: string, options?: { count?: string; head?: boolean }) {
          if (options?.head) {
            isCountOnly = true
          }
          return builder
        },
        eq(col: string, val: any) {
          data = data.filter((item: any) => {
            if (col in item) return item[col] === val
            return true
          })
          return builder
        },
        neq(col: string, val: any) {
          data = data.filter((item: any) => item[col] !== val)
          return builder
        },
        ilike(col: string, pattern: string) {
          const clean = pattern.replace(/%/g, '').toLowerCase()
          data = data.filter((item: any) => String(item[col] || '').toLowerCase().includes(clean))
          return builder
        },
        or(query: string) {
          return builder
        },
        is(col: string, val: any) {
          if (val === null) {
            data = data.filter((item: any) => item[col] === null || item[col] === undefined)
          }
          return builder
        },
        order(col: string, opts?: { ascending?: boolean }) {
          data.sort((a: any, b: any) => {
            const va = a[col]
            const vb = b[col]
            if (opts?.ascending) return va > vb ? 1 : -1
            return va < vb ? 1 : -1
          })
          return builder
        },
        limit(num: number) {
          data = data.slice(0, num)
          return builder
        },
        range(from: number, to: number) {
          data = data.slice(from, to + 1)
          return builder
        },
        single() {
          isSingle = true
          return builder
        },
        // Thenable resolution
        then(resolve: any) {
          const count = data.length
          const result = {
            data: isCountOnly ? null : (isSingle ? (data[0] ?? null) : data),
            count: count,
            error: null,
          }
          return Promise.resolve(result).then(resolve)
        },
      }

      return builder
    },
  }
}

