import { notFound } from 'next/navigation'
import { repository } from '@/lib/data/repository'
import { GamePlayer } from '@/components/portal/game-player'
import { GameCard } from '@/components/portal/game-card'
import { DemoAdBanner } from '@/components/ads/demo-ad-banner'
import type { Game } from '@/types'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const game = await repository.getGameBySlug(slug)
  return { title: game ? `Play ${game.title}` : 'Play Game' }
}

export default async function PlayPage({ params }: PageProps) {
  const { slug } = await params

  const [game, allGamesRes] = await Promise.all([
    repository.getGameBySlug(slug),
    repository.getGames({ limit: 12 }),
  ])

  if (!game || !game.is_active || game.approval_status !== 'approved') notFound()

  const g = game as Game
  const related = allGamesRes.data
    .filter(item => item.id !== g.id && (!g.category_id || item.category_id === g.category_id))
    .slice(0, 4)

  return (
    <div className="container mx-auto px-4 max-w-7xl py-6">
      {/* Demo ad above game - never overlapping or intrusive */}
      <DemoAdBanner placementKey="play_above" className="mb-4" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Game player - takes up 3 columns */}
        <div className="xl:col-span-3">
          <GamePlayer game={g} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <DemoAdBanner placementKey="play_sidebar" orientation="vertical" />

          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              More {g.category?.name} Games
            </h3>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
              {(related ?? [] as Game[]).map((rel: Game) => (
                <GameCard key={rel.id} game={rel} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
