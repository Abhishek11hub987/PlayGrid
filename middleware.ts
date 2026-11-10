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

function getCombinedAuthCookieValue(request: NextRequest): string | null {
  const authCookies = request.cookies
    .getAll()
    .filter(c => c.name.startsWith('sb-') && c.name.includes('auth-token'))

  if (authCookies.length === 0) return null

  const exact = authCookies.find(c => c.name.endsWith('auth-token'))
  if (exact) return exact.value

  return authCookies
    .sort((a, b) => {
      const idxA = Number(a.name.split('.').pop() || 0)
      const idxB = Number(b.name.split('.').pop() || 0)
      return idxA - idxB
    })
    .map(c => c.value)
    .join('')
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  return atob(padded)
}

/**
 * Checks locally whether the session JWT still has >120s validity so Edge middleware
 * does not stall every navigation with an extra remote Supabase Auth round-trip.
 * Protected layouts still verify sessions cryptographically via getAuthUser().
 */
function hasFreshSupabaseJwt(cookieValue: string): boolean {
  try {
    const raw = cookieValue.startsWith('base64-')
      ? decodeBase64Url(cookieValue.slice(7))
      : decodeURIComponent(cookieValue)
    const parsed = JSON.parse(raw)
    const accessToken =
      parsed?.access_token ||
      parsed?.currentSession?.access_token ||
      (Array.isArray(parsed) ? parsed[0] : null)

    if (typeof accessToken !== 'string') return false
    const parts = accessToken.split('.')
    if (parts.length !== 3) return false

    const payload = JSON.parse(decodeBase64Url(parts[1]))
    const exp = Number(payload?.exp || 0)
    return exp > Math.floor(Date.now() / 1000) + 120
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const { pathname } = request.nextUrl
  const isLocalhost = isLocalhostHost(request)
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isPrefetch =
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch'
  const rawAuthCookie = getCombinedAuthCookieValue(request)
  const hasSessionCookie = Boolean(rawAuthCookie)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Block unauthenticated access on deployed hosts immediately without network latency
  if (!isLocalhost && isProtectedPage && (!hasSessionCookie || !url || !key || url.includes('your_supabase') || url.includes('placeholder'))) {
    return redirectToLogin(request, pathname)
  }

  // Skip remote Supabase auth round-trips when no cookie exists, on prefetches, or when JWT is fresh
  if (
    !rawAuthCookie ||
    isPrefetch ||
    !url ||
    !key ||
    url.includes('your_supabase') ||
    url.includes('placeholder') ||
    hasFreshSupabaseJwt(rawAuthCookie)
  ) {
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
