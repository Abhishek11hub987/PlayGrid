import { Suspense } from 'react'
import { HeroSection } from '@/components/portal/hero-section'
import { FeaturedGames } from '@/components/portal/featured-games'
import { CategoryGrid } from '@/components/portal/category-grid'
import { TrendingGames } from '@/components/portal/trending-games'
import { RecentGames } from '@/components/portal/recent-games'
import { LeaderboardPreview } from '@/components/portal/leaderboard-preview'
import { DemoAdBanner } from '@/components/ads/demo-ad-banner'
import { createClient } from '@/lib/supabase/server'
import type { Game, GameCategory } from '@/types'

async function getHomePageData() {
  const supabase = await createClient()

  const [gamesRes, categoriesRes] = await Promise.all([
    supabase
      .from('games')
      .select('*, category:game_categories(*)')
      .eq('approval_status', 'approved')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('play_count', { ascending: false })
      .limit(40),
    supabase
      .from('game_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  return {
    games: (gamesRes.data ?? []) as Game[],
    categories: (categoriesRes.data ?? []) as GameCategory[],
  }
}

export default async function HomePage() {
  const { games, categories } = await getHomePageData()

  const featured = games.filter(g => g.is_featured).length > 0
    ? games.filter(g => g.is_featured).slice(0, 5)
    : games.slice(0, 5)
  const trending = games.slice(0, 12)
  const recent = [...games].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 8)

  return (
    <div className="animate-fade-in">
      <HeroSection featuredGames={featured} />

      <div className="container mx-auto px-4 max-w-7xl py-12 space-y-16">
        {/* Ad banner — demo */}
        <DemoAdBanner placementKey="homepage_top" />

        <Suspense fallback={<GamesSkeletonSection />}>
          <FeaturedGames games={featured} title="🔥 Featured Games" />
        </Suspense>

        <CategoryGrid categories={categories} />

        <Suspense fallback={<GamesSkeletonSection />}>
          <TrendingGames games={trending} />
        </Suspense>

        <DemoAdBanner placementKey="homepage_mid" />

        <Suspense fallback={<GamesSkeletonSection />}>
          <RecentGames games={recent} />
        </Suspense>

        <LeaderboardPreview />
      </div>
    </div>
  )
}

function GamesSkeletonSection() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-48 bg-white/10 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
