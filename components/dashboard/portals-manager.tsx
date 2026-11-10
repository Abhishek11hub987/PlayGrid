'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Globe, ExternalLink, Settings, Pause, Trash2, MoreVertical, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Portal } from '@/types'

export function PortalsManager({ portals, organizationId }: { portals: Portal[], organizationId?: string }) {
  const [list, setList] = useState(portals)

  function handleTogglePause(portalId: string) {
    setList(prev => prev.map(p => {
      if (p.id === portalId) {
        return { ...p, status: p.status === 'published' ? 'paused' : 'published' }
      }
      return p
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Portal Fleet Management</h1>
          <p className="text-white/60 text-sm mt-1">Configure white-label domains, brand themes, and game distributions</p>
        </div>
        <Link href="/dashboard/portals/new">
          <Button className="gap-2 shadow-lg shadow-brand-500/25">
            <Plus className="h-4 w-4" /> Create New Portal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map(portal => (
          <Card key={portal.id} className="border-white/10 hover:border-brand-500/30 transition-all bg-surface-900/90">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">{portal.name}</h3>
                  <p className="text-xs text-white/50 font-mono mt-0.5">/{portal.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={portal.status === 'published' ? 'success' : portal.status === 'paused' ? 'warning' : 'outline'}>
                    {portal.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/portals/${portal.id}`}>
                          <Settings className="h-4 w-4 mr-2" /> Visual Builder
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePause(portal.id)}>
                        <Pause className="h-4 w-4 mr-2" />
                        {portal.status === 'published' ? 'Pause Portal' : 'Publish Portal'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-danger-300">
                        <Trash2 className="h-4 w-4 mr-2" /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-950/60 border border-white/5 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">Theme Preset</span>
                  <span className="text-brand-300 font-semibold">{portal.theme?.preset ?? 'Dark Gaming'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Custom Domain</span>
                  <span className="text-electric-400 font-mono">{portal.custom_domain ?? 'None assigned'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link href={`/dashboard/portals/${portal.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Visual Builder
                  </Button>
                </Link>
                <Link href={`/portal/${portal.slug}`} target="_blank">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-white/70 hover:text-white border border-white/5">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

