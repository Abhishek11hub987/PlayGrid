import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

function isLocalhostHost(request: NextRequest): boolean {
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return false
  }
  const host = (request.headers.get('x-forwarded-host') || request.nextUrl.hostname || '').toLowerCase()
  return (
    host === 'localhost' ||
    host.startsWith('localhost:') ||
    host === '127.0.0.1' ||
    host.startsWith('127.0.0.1:')
  )
}

function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(
    c => c.name.startsWith('sb-') && c.name.includes('auth-token')
  )
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const { pathname } = request.nextUrl
  const isLocalhost = isLocalhostHost(request)
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isPrefetch =
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch'
  const hasSessionCookie = hasSupabaseAuthCookie(request)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Block unauthenticated access on deployed hosts immediately without network latency
  if (!isLocalhost && isProtectedPage && (!hasSessionCookie || !url || !key || url.includes('your_supabase') || url.includes('placeholder'))) {
    return redirectToLogin(request, pathname)
  }

  // Skip remote Supabase auth round-trips when no session cookie exists or during link prefetches
  if (!hasSessionCookie || isPrefetch || !url || !key || url.includes('your_supabase') || url.includes('placeholder')) {
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

    if (!isLocalhost && isProtectedPage && !user) {
      return redirectToLogin(request, pathname)
    }
  } catch {
    if (!isLocalhost && isProtectedPage) {
      return redirectToLogin(request, pathname)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)',
  ],
}
