'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield, Users, Globe, Gamepad2, UploadCloud, FolderTree, Megaphone,
  DollarSign, Receipt, CreditCard, BarChart3, Flag, HelpCircle, FileText,
  Settings, ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { label: 'Admin Overview',    href: '/admin',               icon: Shield },
  { label: 'Publishers',        href: '/admin/publishers',    icon: Users },
  { label: 'Portals',           href: '/admin/portals',       icon: Globe },
  { label: 'Games Catalog',     href: '/admin/games',         icon: Gamepad2 },
  { label: 'Upload & Add Games',href: '/admin/game-uploads',  icon: UploadCloud },
  { label: 'Categories',        href: '/admin/categories',    icon: FolderTree },
  { label: 'Ad Providers',      href: '/admin/advertising',   icon: Megaphone },
  { label: 'Revenue & Splits',  href: '/admin/revenue',       icon: DollarSign },
  { label: 'Subscriptions',     href: '/admin/subscriptions', icon: Receipt },
  { label: 'Moderation',        href: '/admin/moderation',    icon: Flag },
  { label: 'Support Desk',      href: '/admin/support',       icon: HelpCircle },
  { label: 'Audit Logs',        href: '/admin/audit-logs',    icon: FileText },
  { label: 'Platform Settings', href: '/admin/settings',      icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  useEffect(() => {
    setPendingHref(null)
  }, [pathname])

  const effectivePath = pendingHref ?? pathname

  return (
    <aside className="w-64 flex flex-col bg-surface-900 border-r border-yellow-500/20 shrink-0 z-20">
      {/* Super Admin Badge header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-yellow-500/20 bg-yellow-500/5">
        <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-yellow-400 tracking-tight">Super Admin</div>
          <div className="text-[10px] text-yellow-400/60 font-mono">ROOT PLATFORM ACCESS</div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-white/30 uppercase tracking-widest px-3 mb-2 font-bold">
          Platform Operations
        </p>
        {ADMIN_NAV.map(item => {
          const active = effectivePath === item.href || (item.href !== '/admin' && effectivePath.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} onClick={() => setPendingHref(item.href)}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors duration-100',
                active
                  ? 'text-yellow-400 bg-yellow-500/15 border border-yellow-500/30 font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}>
                <item.icon className={cn('h-4 w-4 shrink-0', active ? 'text-yellow-400' : 'text-white/40')} />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Switcher back to Publisher SaaS */}
      <div className="p-3 border-t border-white/5 bg-surface-950/60">
        <Link href="/dashboard">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="h-4 w-4 text-brand-400" />
            <span>Back to Publisher SaaS</span>
          </div>
        </Link>
      </div>
    </aside>
  )
}

