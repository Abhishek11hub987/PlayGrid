import { Suspense } from 'react'
import { repository } from '@/lib/data/repository'
import { GameGrid } from '@/components/portal/game-grid'
import { GameFilters } from '@/components/portal/game-filters'
import type { Game, GameCategory } from '@/types'

export const metadata = { title: 'All Games' }

interface PageProps {
  searchParams: Promise<{ category?: string; sort?: string; q?: string; page?: string }>
}

export default async function GamesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { category, sort = 'popular', q, page = '1' } = params
  const pageNum = Math.max(1, parseInt(page))
  const pageSize = 24
  const offset = (pageNum - 1) * pageSize

  const [{ data: games, count }, allCategories] = await Promise.all([
    repository.getGames({
      categorySlug: category,
      sort,
      search: q,
      limit: pageSize,
      offset,
    }),
    repository.getCategories(),
  ])

  const categories = allCategories.filter(c => c.is_active)

  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Game Library</h1>
        <p className="text-white/60">
          {count ?? 0} games available — play instantly, no download required
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <GameFilters
            categories={(categories ?? []) as GameCategory[]}
            selectedCategory={category}
            selectedSort={sort}
            searchQuery={q}
          />
        </aside>
        <div className="flex-1">
          <GameGrid
            games={(games ?? []) as Game[]}
            totalPages={totalPages}
            currentPage={pageNum}
          />
        </div>
      </div>
    </div>
  )
}
