import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // In development without live Supabase credentials, pass through seamlessly
  if (!url || !key || url.includes('your_supabase') || url.includes('placeholder')) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      url,
      key,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const { pathname, hostname } = request.nextUrl
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'

    // Protect dashboard routes on live public deployment without active session
    if (!isLocalhost && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  } catch {
    // Fail open in edge middleware, layout will enforce authorization
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)',
  ],
}
