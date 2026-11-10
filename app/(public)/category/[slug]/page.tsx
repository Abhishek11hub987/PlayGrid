import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GameGrid } from '@/components/portal/game-grid'
import type { GameCategory, Game } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('game_categories').select('name, description').eq('slug', slug).single()
  return { title: data ? `${data.name} Games` : 'Category' }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page = '1', sort = 'popular' } = await searchParams

  const supabase = await createClient()

  const { data: category } = await supabase
    .from('game_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const cat = category as GameCategory
  const pageNum = Math.max(1, parseInt(page))
  const pageSize = 24
  const offset = (pageNum - 1) * pageSize

  let query = supabase
    .from('games')
    .select('*, category:game_categories(*)', { count: 'exact' })
    .eq('category_id', cat.id)
    .eq('approval_status', 'approved')
    .eq('is_active', true)
    .is('deleted_at', null)

  if (sort === 'popular') query = query.order('play_count', { ascending: false })
  else if (sort === 'recent') query = query.order('created_at', { ascending: false })
  else if (sort === 'rating') query = query.order('rating_average', { ascending: false })

  const { data: games, count } = await query.range(offset, offset + pageSize - 1)

  const totalPages = Math.ceil((count ?? 0) / pageSize)

  return (
    <div className="container mx-auto px-4 max-w-7xl py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${cat.color}20` }}
          >
            🎮
          </div>
          <h1 className="text-3xl font-bold text-white">{cat.name} Games</h1>
        </div>
        {cat.description && <p className="text-white/60">{cat.description}</p>}
        <p className="text-white/40 text-sm mt-1">{count ?? 0} games</p>
      </div>

      <GameGrid
        games={(games ?? []) as Game[]}
        totalPages={totalPages}
        currentPage={pageNum}
      />
    </div>
  )
}
