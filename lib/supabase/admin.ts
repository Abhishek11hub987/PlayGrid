import { createClient } from '@supabase/supabase-js'
import { createMockSupabaseClient } from './mock-client'

// Server-side only
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey || url.includes('your_supabase') || serviceKey.includes('your_supabase')) {
    return createMockSupabaseClient() as any
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
