'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users, Search, CheckCircle, XCircle, AlertTriangle, Shield,
  MoreVertical, RefreshCw, ExternalLink
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { Organization } from '@/types'

export function AdminPublishersManager({ initialOrganizations }: { initialOrganizations: Organization[] }) {
  const [organizations, setOrganizations] = useState(initialOrganizations)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = organizations.filter(org => {
    const matchesSearch = !search || org.name.toLowerCase().includes(search.toLowerCase()) || org.slug.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function updateStatus(id: string, newStatus: 'active' | 'suspended' | 'rejected' | 'pending') {
    setOrganizations(prev => prev.map(org => {
      if (org.id === id) {
        return { ...org, status: newStatus }
      }
      return org
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Publisher Directory & Compliance</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <Shield className="h-3 w-3" /> SUPER ADMIN DIRECTORY
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Review registration requests, enforce anti-fraud policy, and administer publisher access.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search publishers by brand name or slug..."
            className="pl-9 h-10 text-xs"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-900 border border-white/10 rounded-xl text-xs font-semibold">
          {['all', 'active', 'pending', 'suspended'].map(s => (
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

      {/* Publishers Table */}
      <Card className="border-white/10 bg-surface-900/90 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-semibold">
                  <th className="px-5 py-3.5">Publisher Entity</th>
                  <th className="px-5 py-3.5">Subscription Plan</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(org => (
                  <tr key={org.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{org.name}</div>
                      <div className="text-white/40 text-[11px] font-mono mt-0.5">/{org.slug}</div>
                      {org.website && (
                        <a href={org.website} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline text-[10px] flex items-center gap-1 mt-0.5">
                          <span>{org.website}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {org.plan_id ? org.plan_id.replace('plan-', '') : 'FREE'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-[11px]">
                      {new Date(org.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={
                        org.status === 'active' ? 'success' :
                        org.status === 'pending' ? 'warning' : 'destructive'
                      } className="text-[10px] uppercase">
                        {org.status}
                      </Badge>
                      {org.rejection_reason && (
                        <p className="text-danger-300 text-[10px] mt-1 line-clamp-1">{org.rejection_reason}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {org.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(org.id, 'active')}
                            className="h-7 text-[10px] bg-green-500 hover:bg-green-600 text-white font-bold"
                          >
                            Approve
                          </Button>
                        )}
                        {org.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(org.id, 'suspended')}
                            className="h-7 text-[10px] border-danger-500/30 text-danger-300 hover:bg-danger-500/10"
                          >
                            Suspend
                          </Button>
                        )}
                        {org.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(org.id, 'active')}
                            className="h-7 text-[10px] border-green-500/30 text-green-400 hover:bg-green-500/10"
                          >
                            Reactivate
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

