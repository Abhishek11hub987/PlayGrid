import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { repository } from '@/lib/data/repository'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GameCard } from '@/components/portal/game-card'
import { DemoAdBanner } from '@/components/ads/demo-ad-banner'
import { Play, Star, Users, Gamepad2, Monitor, Smartphone } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { Game } from '@/types'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const game = await repository.getGameBySlug(slug)
  if (!game) return { title: 'Game Not Found' }
  return { title: game.title, description: game.short_description }
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [game, allGamesRes] = await Promise.all([
    repository.getGameBySlug(slug),
    repository.getGames({ limit: 16 }),
  ])

  if (!game || !game.is_active || game.approval_status !== 'approved') notFound()

  const g = game as Game
  const related = allGamesRes.data
    .filter(item => item.id !== g.id && (!g.category_id || item.category_id === g.category_id))
    .slice(0, 6)

  const thumbnailSrc = g.thumbnail_url || `/thumbnails/${g.slug}.svg`

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game header */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-900">
            <Image src={thumbnailSrc} alt={g.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                {g.category && (
                  <Badge variant="default">{g.category.name}</Badge>
                )}
                <Badge variant="success">Free to Play</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{g.title}</h1>
              <Link href={`/play/${g.slug}`}>
                <Button size="xl" variant="glow" className="gap-3">
                  <Play className="h-5 w-5 fill-white" />
                  Play Now — Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-brand-400 mb-1">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold text-white">{formatNumber(g.play_count)}</div>
              <div className="text-xs text-white/50">Plays</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-yellow-400 mb-1">
                <Star className="h-4 w-4 fill-yellow-400" />
              </div>
              <div className="text-xl font-bold text-white">{g.rating_average.toFixed(1)}</div>
              <div className="text-xs text-white/50">{formatNumber(g.rating_count)} ratings</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-electric-400 mb-1">
                <Gamepad2 className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold text-white capitalize">{g.technology}</div>
              <div className="text-xs text-white/50">Technology</div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">About this game</h2>
            <p className="text-white/70 leading-relaxed">{g.description}</p>

            {g.instructions && (
              <>
                <h3 className="text-md font-semibold text-white">How to Play</h3>
                <p className="text-white/70 leading-relaxed">{g.instructions}</p>
              </>
            )}

            {g.controls && (
              <>
                <h3 className="text-md font-semibold text-white">Controls</h3>
                <p className="text-white/70 leading-relaxed font-mono text-sm">{g.controls}</p>
              </>
            )}
          </div>

          {/* Device support */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-md font-semibold text-white mb-3">Supported Devices</h3>
            <div className="flex gap-3">
              {g.supported_devices.includes('desktop') && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Monitor className="h-4 w-4 text-brand-400" /> Desktop
                </div>
              )}
              {g.supported_devices.includes('mobile') && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Smartphone className="h-4 w-4 text-electric-400" /> Mobile
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DemoAdBanner placementKey="game_detail_sidebar" orientation="vertical" />

          {/* Play CTA */}
          <div className="glass-card rounded-xl p-6 text-center space-y-4">
            <h3 className="text-lg font-semibold text-white">Ready to play?</h3>
            <p className="text-white/60 text-sm">Free. Instant. No download required.</p>
            <Link href={`/play/${g.slug}`} className="block">
              <Button size="lg" variant="glow" className="w-full gap-2">
                <Play className="h-4 w-4 fill-white" />
                Play {g.title}
              </Button>
            </Link>
          </div>

          {/* Game info */}
          <div className="glass-card rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Game Info</h3>
            <dl className="space-y-2 text-sm">
              {g.developer && (
                <div className="flex justify-between">
                  <dt className="text-white/50">Developer</dt>
                  <dd className="text-white/80">{g.developer}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-white/50">Category</dt>
                <dd className="text-white/80">{g.category?.name ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Orientation</dt>
                <dd className="text-white/80 capitalize">{g.orientation}</dd>
              </div>
            </dl>
          </div>

          {/* Tags */}
          {g.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {g.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related games */}
      {(related ?? []).length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">More {g.category?.name} Games</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(related as Game[]).map(rel => (
              <GameCard key={rel.id} game={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
