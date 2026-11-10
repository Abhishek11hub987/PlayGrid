'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(defaultValue ?? '')

  useEffect(() => { setQ(defaultValue ?? '') }, [defaultValue])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('q', q.trim())
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleClear() {
    setQ('')
    router.push(pathname)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
      <Input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search games, categories, keywords..."
        className="pl-12 pr-10 h-12 text-base rounded-xl"
        autoFocus
      />
      {q && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
