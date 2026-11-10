'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Tv2, LayoutDashboard, Globe, Gamepad2, UploadCloud, Megaphone, BarChart3,
  DollarSign, Users, Settings, Shield, ChevronLeft, Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { AuthUser } from '@/lib/auth/get-user'

const NAV_ITEMS = [
  { label: 'Overview',     href: '/dashboard',              icon: LayoutDashboard },
  { label: 'Portals',      href: '/dashboard/portals',      icon: Globe },
  { label: 'Game Catalog', href: '/dashboard/games',        icon: Gamepad2 },
  { label: 'Upload & Add Games', href: '/admin/game-uploads', icon: UploadCloud },
  { label: 'Advertising',  href: '/dashboard/advertising',  icon: Megaphone },
  { label: 'Analytics',    href: '/dashboard/analytics',    icon: BarChart3 },
  { label: 'Revenue',      href: '/dashboard/revenue',      icon: DollarSign },
  { label: 'Team',         href: '/dashboard/team',         icon: Users },
  { label: 'Settings',     href: '/dashboard/settings',     icon: Settings },
]

export function DashboardSidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col bg-surface-900 border-r border-white/5 transition-all duration-300 shrink-0 z-20',
      collapsed ? 'w-20' : 'w-64'
    )}>
      {/* Brand header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="bg-brand-500 rounded-lg p-2 shrink-0 shadow-lg shadow-brand-500/30">
            <Tv2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-lg tracking-tight">
              Play<span className="text-brand-400">Grid</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/40 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-white/30 text-xs uppercase tracking-wider px-3 mb-2 font-semibold">
            Publisher SaaS
          </p>
        )}
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'text-white bg-brand-500/20 border border-brand-500/30 text-brand-300'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
                collapsed && 'justify-center px-2'
              )}>
                <item.icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', active && 'text-brand-400')} />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Super Admin Switcher */}
      {user.isSuperAdmin && (
        <div className="p-3 border-t border-white/5">
          <Link href="/admin">
            <div className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all',
              collapsed && 'justify-center'
            )}>
              <Shield className="h-4 w-4 shrink-0 text-yellow-400" />
              {!collapsed && <span>Super Admin Panel</span>}
            </div>
          </Link>
        </div>
      )}

      {/* Publisher User preview */}
      {!collapsed && (
        <div className="p-4 border-t border-white/5 bg-surface-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xs font-bold text-brand-300">
              {(user.profile?.display_name ?? 'P').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user.profile?.display_name ?? 'PlayGrid Studios'}
              </p>
              <p className="text-brand-400 text-xs truncate">Pro Publisher</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

