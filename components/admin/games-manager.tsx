'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Gamepad2, Search, CheckCircle, XCircle, Plus, Eye,
  Star, ExternalLink, ShieldAlert
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Game, GameCategory } from '@/types'

export function AdminGamesManager({ initialGames, categories }: { initialGames: Game[], categories: GameCategory[] }) {
  const [games, setGames] = useState(initialGames)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = games.filter(g => {
    const matchesSearch = !search || g.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || g.approval_status === statusFilter
    return matchesSearch && matchesStatus
  })

  function handleToggleApproval(gameId: string, newStatus: 'approved' | 'rejected' | 'pending') {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        return { ...g, approval_status: newStatus, is_active: newStatus === 'approved' }
      }
      return g
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Global Game Library & Licensure</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <Gamepad2 className="h-3 w-3" /> SUPER ADMIN VERIFIED CATALOG ({games.length})
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Approve game builds, verify iframe sandboxing, review licensing, and manage global distribution permissions.
          </p>
        </div>
        <Link href="/admin/game-uploads">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 text-xs shadow-lg shadow-yellow-500/25">
            <Plus className="h-4 w-4" /> Add Distributor / HTML5 Game
          </Button>
        </Link>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search game titles, tags, or developers..."
            className="pl-9 h-10 text-xs"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-900 border border-white/10 rounded-xl text-xs font-semibold">
          {['all', 'approved', 'pending', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                statusFilter === s ? 'bg-yellow-500 text-black font-bold shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="border-white/10 bg-surface-900/90 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-semibold">
                  <th className="px-5 py-3.5">Game Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Licensure / Origin</th>
                  <th className="px-5 py-3.5">Verified Plays</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Approval Decisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(game => (
                  <tr key={game.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-lg bg-surface-950 overflow-hidden shrink-0">
                          <Image
                            src={game.thumbnail_url || `/thumbnails/${game.slug}.svg`}
                            alt={game.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{game.title}</div>
                          <div className="text-white/40 text-[10px] font-mono">{game.developer ?? 'PlayGrid Studios'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/80">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {game.category?.name ?? 'Arcade'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-white/60 text-[11px]">
                      {game.license_type}
                    </td>
                    <td className="px-5 py-4 text-white/80 font-mono">
                      {game.play_count.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={
                        game.approval_status === 'approved' ? 'success' :
                        game.approval_status === 'pending' ? 'warning' : 'destructive'
                      } className="text-[10px] uppercase">
                        {game.approval_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/play/${game.slug}`} target="_blank">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-white/60 hover:text-white" title="Test Game Player">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        {game.approval_status !== 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => handleToggleApproval(game.id, 'approved')}
                            className="h-7 text-[10px] bg-green-500 hover:bg-green-600 text-white font-bold"
                          >
                            Approve
                          </Button>
                        )}
                        {game.approval_status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleApproval(game.id, 'rejected')}
                            className="h-7 text-[10px] border-danger-500/30 text-danger-300 hover:bg-danger-500/10"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

