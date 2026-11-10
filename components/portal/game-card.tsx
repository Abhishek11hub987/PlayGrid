import Link from 'next/link'
import Image from 'next/image'
import { Play, Star } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import type { Game } from '@/types'

interface GameCardProps {
  game: Game
  size?: 'sm' | 'md' | 'lg'
}

export function GameCard({ game, size = 'md' }: GameCardProps) {
  const thumbnailSrc = game.thumbnail_url || `/thumbnails/${game.slug}.svg`

  return (
    <Link href={`/game/${game.slug}`} className="block">
      <div className="game-card group">
        {/* Thumbnail */}
        <div className={`relative overflow-hidden rounded-xl bg-surface-900 ${size === 'lg' ? 'aspect-video' : 'aspect-[4/3]'}`}>
          <Image
            src={thumbnailSrc}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-brand-500 rounded-full p-3 shadow-lg shadow-brand-500/50">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>

          {/* Featured badge */}
          {game.is_featured && (
            <div className="absolute top-2 left-2 bg-brand-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-2 px-0.5">
          <h3 className="font-semibold text-white text-sm leading-tight truncate group-hover:text-brand-300 transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-white/50 capitalize">{game.category?.name ?? 'Game'}</span>
            <div className="flex items-center gap-1">
              {game.rating_average > 0 && (
                <>
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white/60">{game.rating_average.toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-xs text-white/40 mt-0.5">{formatNumber(game.play_count)} plays</div>
        </div>
      </div>
    </Link>
  )
}
