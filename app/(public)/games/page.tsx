import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
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

  const supabase = await createClient()

  let query = supabase
    .from('games')
    .select('*, category:game_categories(*)', { count: 'exact' })
    .eq('approval_status', 'approved')
    .eq('is_active', true)
    .is('deleted_at', null)

  if (q) query = query.ilike('title', `%${q}%`)
  if (category) {
    const { data: cat } = await supabase.from('game_categories').select('id').eq('slug', category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (sort === 'popular') query = query.order('play_count', { ascending: false })
  else if (sort === 'recent') query = query.order('created_at', { ascending: false })
  else if (sort === 'rating') query = query.order('rating_average', { ascending: false })

  const { data: games, count } = await query.range(offset, offset + pageSize - 1)

  const { data: categories } = await supabase
    .from('game_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

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
