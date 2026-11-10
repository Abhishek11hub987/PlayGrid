import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, Play, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/utils'
import type { Game } from '@/types'

interface TrendingGamesProps { games: Game[] }

export function TrendingGames({ games }: TrendingGamesProps) {
  if (games.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-electric-400" />
          <h2 className="text-2xl font-bold text-white">Trending Now</h2>
        </div>
        <Link href="/games?sort=popular">
          <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
            See more <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.slice(0, 6).map((game, index) => (
          <Link key={game.id} href={`/game/${game.slug}`}>
            <div className="flex gap-3 glass-card rounded-xl p-3 hover:border-brand-500/30 transition-all group cursor-pointer">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={game.thumbnail_url || `/thumbnails/${game.slug}.svg`}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-white/30">#{index + 1}</span>
                  <h3 className="font-semibold text-white text-sm truncate group-hover:text-brand-300 transition-colors">
                    {game.title}
                  </h3>
                </div>
                <p className="text-xs text-white/50 capitalize">{game.category?.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{formatNumber(game.play_count)} plays</p>
              </div>
              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-brand-500 rounded-full p-1.5">
                  <Play className="h-3 w-3 text-white fill-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
