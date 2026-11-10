import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GameCard } from './game-card'
import type { Game } from '@/types'

export function RecentGames({ games }: { games: Game[] }) {
  if (games.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-brand-400" />
          <h2 className="text-2xl font-bold text-white">Recently Added</h2>
        </div>
        <Link href="/games?sort=recent">
          <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
            See all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {games.slice(0, 8).map(game => (
          <GameCard key={game.id} game={game} size="sm" />
        ))}
      </div>
    </section>
  )
}
