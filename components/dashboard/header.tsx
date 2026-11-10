'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, ExternalLink, User, Settings, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { AuthUser } from '@/lib/auth/get-user'
import Link from 'next/link'

export function DashboardHeader({ user }: { user: AuthUser }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = (user.profile?.display_name ?? user.email ?? 'P')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-surface-900/95">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          Multi-Tenant SaaS Engine
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" target="_blank">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-1.5 text-xs">
            <ExternalLink className="h-3.5 w-3.5" />
            Live Network
          </Button>
        </Link>

        <Button variant="ghost" size="icon" className="relative text-white/70 hover:text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <Avatar className="h-8 w-8 ring-1 ring-brand-500/40">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-white leading-none">
                  {user.profile?.display_name ?? 'Studio Admin'}
                </p>
                <p className="text-[10px] text-white/40 leading-none mt-1">Super Admin & Owner</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="text-white font-semibold text-sm">{user.profile?.display_name ?? 'Studio Admin'}</p>
                <p className="text-white/40 text-xs truncate mt-0.5">{user.email ?? 'admin@playgrid.io'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2 text-white/70" /> Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/revenue" className="cursor-pointer">
                <Sparkles className="h-4 w-4 mr-2 text-brand-400" /> Revenue & Payouts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-danger-300 cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

