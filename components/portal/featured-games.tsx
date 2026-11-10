import Link from 'next/link'
import { GameCard } from './game-card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Game } from '@/types'

interface FeaturedGamesProps {
  games: Game[]
  title?: string
}

export function FeaturedGames({ games, title = '🔥 Featured Games' }: FeaturedGamesProps) {
  if (games.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link href="/games">
          <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {games.slice(0, 5).map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}
