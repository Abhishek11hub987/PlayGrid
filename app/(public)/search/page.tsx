import { repository } from '@/lib/data/repository'
import { GameGrid } from '@/components/portal/game-grid'
import { SearchInput } from '@/components/portal/search-input'
import { Search } from 'lucide-react'
import type { Game } from '@/types'

export const metadata = { title: 'Search Games' }

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page = '1' } = await searchParams
  const pageNum = Math.max(1, parseInt(page))
  const pageSize = 24
  const offset = (pageNum - 1) * pageSize

  let games: Game[] = []
  let count = 0

  if (q && q.trim().length >= 2) {
    const res = await repository.getGames({
      search: q.trim(),
      limit: pageSize,
      offset,
    })
    games = res.data
    count = res.count
  }

  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-4">Search Games</h1>
        <SearchInput defaultValue={q} />
      </div>

      {q ? (
        <div>
          <p className="text-white/60 mb-6 text-sm">
            {count} result{count !== 1 ? 's' : ''} for <strong className="text-white">"{q}"</strong>
          </p>
          {games.length > 0 ? (
            <GameGrid games={games} totalPages={totalPages} currentPage={pageNum} />
          ) : (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/60 mb-2">No games found</h3>
              <p className="text-white/40">Try a different search term or browse all games.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/60">Search for games</h3>
          <p className="text-white/40 mt-2">Enter a game name, category or keyword.</p>
        </div>
      )}
    </div>
  )
}
