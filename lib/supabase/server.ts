import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createMockSupabaseClient } from './mock-client'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey || url.includes('your_supabase') || url.includes('placeholder')) {
    return createMockSupabaseClient() as any
  }

  // Use service role key on the server when available so server components can reliably
  // query approved games, categories, and plans even if public RLS policies are pending.
  const key = serviceKey || anonKey

  const cookieStore = await cookies()
  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
