import { createBrowserClient } from '@supabase/ssr'
import { createMockSupabaseClient } from './mock-client'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('your_supabase') || url.includes('placeholder')) {
    return createMockSupabaseClient() as any
  }

  return createBrowserClient(url, key)
}
