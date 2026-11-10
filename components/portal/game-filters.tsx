'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { GameCategory } from '@/types'
import { useCallback, useState } from 'react'

interface GameFiltersProps {
  categories: GameCategory[]
  selectedCategory?: string
  selectedSort?: string
  searchQuery?: string
}

const SORT_OPTIONS = [
  { value: 'popular', label: '🔥 Most Popular' },
  { value: 'recent', label: '🆕 Recently Added' },
  { value: 'rating', label: '⭐ Top Rated' },
]

export function GameFilters({ categories, selectedCategory, selectedSort = 'popular', searchQuery }: GameFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchQuery ?? '')

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParam('q', q || undefined)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search games..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="pl-9"
          />
          {q && (
            <button type="button" onClick={() => { setQ(''); updateParam('q', undefined) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Sort by</h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                selectedSort === opt.value
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', undefined)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
              !selectedCategory
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/8'
            )}
          >
            🎮 All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                selectedCategory === cat.slug
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(selectedCategory || searchQuery || selectedSort !== 'popular') && (
        <Button variant="outline" size="sm" className="w-full" onClick={() => router.push(pathname)}>
          <X className="h-4 w-4 mr-2" /> Clear filters
        </Button>
      )}
    </div>
  )
}
