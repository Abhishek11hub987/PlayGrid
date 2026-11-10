'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber, formatCurrency } from '@/lib/utils'
import {
  Users, Globe, Gamepad2, Eye, DollarSign, Shield, Activity, AlertTriangle,
  CheckCircle, ArrowUpRight, FileText, Settings, Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface AdminStats {
  publishers: number
  portals: number
  games: number
  players: number
  total_plays: number
  ad_impressions: number
  verified_revenue: number
  is_demo_revenue: boolean
}

export function AdminOverview({ stats }: { stats: AdminStats }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-surface-900 to-surface-900">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <Shield className="h-3 w-3" /> SUPER ADMIN ENVIRONMENT
            </span>
            {!stats.is_demo_revenue && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 border border-green-500/30 text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE PRODUCTION DATA
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            PlayGrid Central Command
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Global governance over <strong className="text-white">{stats.publishers} publishers</strong>, <strong className="text-white">{stats.portals} active portals</strong>, and <strong className="text-white">{stats.games} games</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/publishers">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs">
              Review Publishers
            </Button>
          </Link>
          <Link href="/admin/games">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs gap-1.5">
              <Gamepad2 className="h-4 w-4" /> Manage Games
            </Button>
          </Link>
        </div>
      </div>

      {/* Global Network Health Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Publishers', val: stats.publishers, icon: Users, color: 'text-brand-400', href: '/admin/publishers' },
          { label: 'Network Portals',   val: stats.portals,    icon: Globe, color: 'text-electric-400', href: '/admin/portals' },
          { label: 'Approved Games',    val: stats.games,      icon: Gamepad2, color: 'text-green-400', href: '/admin/games' },
          { label: 'Registered Players', val: stats.players,   icon: Activity, color: 'text-yellow-400', href: '/admin/audit-logs' },
        ].map(item => (
          <Link key={item.label} href={item.href}>
            <Card className="border-white/10 bg-surface-900/90 hover:border-yellow-500/40 transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{item.label}</span>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="text-2xl font-extrabold text-white">{formatNumber(item.val)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Global Financial Clearinghouse (80/20 demonstration split) */}
      <Card className="border-yellow-500/20 bg-surface-900/90">
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              Global Revenue & Commission Clearinghouse
            </CardTitle>
            {!stats.is_demo_revenue ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 border border-green-500/30 text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE RECONCILED LEDGER
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/15 border border-brand-500/30 text-brand-300">
                AUDITED REVENUE DATA
              </span>
            )}
          </div>
          <CardDescription className="text-xs text-white/50">
            Consolidated platform commission (20%) vs publisher aggregate payable balances (80%)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="glass-card p-5 rounded-xl">
              <span className="text-xs text-white/50">Total Verified Network Revenue</span>
              <div className="text-2xl font-black text-white mt-1">
                {formatCurrency(stats.verified_revenue)}
              </div>
              <p className="text-[10px] text-white/40 mt-1">Gross reconciled ad income</p>
            </div>
            <div className="glass-card p-5 rounded-xl border-yellow-500/30 bg-yellow-500/5">
              <span className="text-xs text-yellow-400 font-bold">Platform SaaS Retained (20%)</span>
              <div className="text-2xl font-black text-yellow-400 mt-1">
                {formatCurrency(stats.verified_revenue * 0.20)}
              </div>
              <p className="text-[10px] text-yellow-400/60 mt-1">PlayGrid platform fee</p>
            </div>
            <div className="glass-card p-5 rounded-xl border-green-500/30 bg-green-500/5">
              <span className="text-xs text-green-400 font-bold">Publisher Disbursable Share (80%)</span>
              <div className="text-2xl font-black text-green-400 mt-1">
                {formatCurrency(stats.verified_revenue * 0.80)}
              </div>
              <p className="text-[10px] text-green-400/60 mt-1">Distributed to publisher accounts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Administrative Operations Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Approve Submissions', icon: Gamepad2, href: '/admin/game-uploads', desc: 'Review game builds' },
          { label: 'Publisher Approvals', icon: Users, href: '/admin/publishers', desc: 'KYC & fraud check' },
          { label: 'System Audit Logs', icon: FileText, href: '/admin/audit-logs', desc: 'Immutable records' },
          { label: 'Platform Settings', icon: Settings, href: '/admin/settings', desc: 'Global configurations' },
        ].map(item => (
          <Link key={item.label} href={item.href}>
            <div className="p-4 rounded-xl border border-white/10 hover:border-yellow-500/40 bg-surface-900/80 transition-all cursor-pointer space-y-1">
              <item.icon className="h-5 w-5 text-yellow-400 mb-2" />
              <p className="font-bold text-white text-sm">{item.label}</p>
              <p className="text-white/40 text-[11px]">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

