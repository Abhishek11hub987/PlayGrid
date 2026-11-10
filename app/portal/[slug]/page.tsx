import { notFound } from 'next/navigation'
import { repository } from '@/lib/data/repository'
import Link from 'next/link'
import Image from 'next/image'
import { GameCard } from '@/components/portal/game-card'
import { DemoAdBanner } from '@/components/ads/demo-ad-banner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, Play, Sparkles, ArrowRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const portal = await repository.getPortalBySlug(slug)
  if (!portal) return { title: 'Portal Not Found' }
  return {
    title: portal.seo_title ?? `${portal.name} — Free HTML5 Games`,
    description: portal.seo_description ?? portal.tagline,
  }
}

export default async function TenantPortalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const portal = await repository.getPortalBySlug(slug)

  if (!portal || portal.status !== 'published') {
    notFound()
  }

  const { data: allGames } = await repository.getGames({ limit: 12 })
  const categories = await repository.getCategories()

  const primaryColor = portal.theme?.primary_color ?? '#6720ff'
  const accentColor = portal.theme?.accent_color ?? '#0ea5e9'

  return (
    <div className="min-h-screen text-white flex flex-col" style={{
      background: 'linear-gradient(180deg, #07040d 0%, #030712 100%)'
    }}>
      {/* White-label Portal Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
          <Link href={`/portal/${portal.slug}`} className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg text-lg"
              style={{ backgroundColor: primaryColor }}
            >
              🎮
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">{portal.name}</span>
              {portal.custom_domain && (
                <span className="block text-[10px] text-white/40 font-mono -mt-0.5">{portal.custom_domain}</span>
              )}
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-white/50 hover:text-white flex items-center gap-1">
              <span>Powered by PlayGrid</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative py-16 px-4 overflow-hidden border-b border-white/5" style={{
        background: `radial-gradient(ellipse at top, ${primaryColor}25 0%, transparent 70%)`
      }}>
        <div className="container mx-auto max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border" style={{
            backgroundColor: `${primaryColor}15`,
            borderColor: `${primaryColor}40`,
            color: accentColor,
          }}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>White-Label Gaming Portal</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {portal.tagline ?? `Welcome to ${portal.name}`}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm leading-relaxed">
            {portal.description ?? 'Play the latest curated HTML5 browser games on web, tablet, and mobile with zero downloads.'}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 max-w-7xl py-10 flex-1 space-y-12">
        <DemoAdBanner placementKey="tenant_portal_top" />

        {/* Featured Games */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Featured On {portal.name}</h2>
              <p className="text-xs text-white/50">Hand-picked top titles</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allGames.slice(0, 6).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Trending Games</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allGames.slice(6, 12).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <DemoAdBanner placementKey="tenant_portal_bottom" />
      </main>

      {/* White-Label Footer */}
      <footer className="border-t border-white/5 bg-surface-950/90 py-8 text-center text-xs text-white/40">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} {portal.name}. All game content licensed via PlayGrid Network.</p>
          <div className="mt-2 flex items-center justify-center gap-4 text-white/30 text-[11px]">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

