import { notFound } from 'next/navigation'
import { repository } from '@/lib/data/repository'
import { GameGrid } from '@/components/portal/game-grid'
import type { GameCategory, Game } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const cat = await repository.getCategoryBySlug(slug)
  return { title: cat ? `${cat.name} Games` : 'Category' }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page = '1', sort = 'popular' } = await searchParams
  const pageNum = Math.max(1, parseInt(page))
  const pageSize = 24
  const offset = (pageNum - 1) * pageSize

  const [category, { data: games, count }] = await Promise.all([
    repository.getCategoryBySlug(slug),
    repository.getGames({ categorySlug: slug, sort, limit: pageSize, offset }),
  ])

  if (!category) notFound()

  const cat = category as GameCategory

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
