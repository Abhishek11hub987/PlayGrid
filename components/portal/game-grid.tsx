'use client'

import Link from 'next/link'
import { GameCard } from './game-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import type { Game } from '@/types'

interface GameGridProps {
  games: Game[]
  totalPages: number
  currentPage: number
}

export function GameGrid({ games, totalPages, currentPage }: GameGridProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Gamepad2 className="h-16 w-16 text-white/20 mb-4" />
        <h3 className="text-xl font-semibold text-white/60 mb-2">No games found</h3>
        <p className="text-white/40 text-sm">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-white/60 text-sm px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
