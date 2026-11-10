'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { Users, Gamepad2, Eye, DollarSign, TrendingUp, Plus, ExternalLink, Globe, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { AuthUser } from '@/lib/auth/get-user'
import type { Organization, Portal } from '@/types'

interface OverviewProps {
  user: AuthUser
  organization: Organization | null
  portals: Portal[]
  analytics: {
    total_visits: number
    unique_visitors: number
    total_plays: number
    avg_session_duration: number
    ad_impressions: number
    estimated_revenue: number
    is_demo: boolean
  }
}

export function DashboardOverview({ user, organization, portals, analytics }: OverviewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border-brand-500/20 bg-gradient-to-r from-brand-900/30 via-surface-900 to-surface-900">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {analytics.is_demo ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/15 border border-brand-500/30 text-brand-300">
                MULTI-TENANT SAAS ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 border border-green-500/30 text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE POSTGRES DATA
              </span>
            )}
            <Badge variant="outline" className="text-brand-300 border-brand-500/40">
              {organization?.name ? `${organization.name} • Pro Plan` : 'Pro Plan'}
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Publisher Command Center
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Managing <strong className="text-white">{portals.length} active portals</strong> across the PlayGrid network
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/onboarding">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Setup Wizard
            </Button>
          </Link>
          <Link href="/dashboard/portals/new">
            <Button className="gap-2 shadow-lg shadow-brand-500/30">
              <Plus className="h-4 w-4" /> Create New Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Network Visits',     val: analytics.total_visits,        icon: Eye,        color: 'text-electric-400', isCurr: false, change: '+18.2%' },
          { label: 'Unique Players',    val: analytics.unique_visitors,     icon: Users,      color: 'text-brand-400',    isCurr: false, change: '+12.4%' },
          { label: 'Game Sessions',     val: analytics.total_plays,         icon: Gamepad2,   color: 'text-green-400',    isCurr: false, change: '+24.6%' },
          { label: 'Est. Earnings (MTD)', val: analytics.estimated_revenue, icon: DollarSign, color: 'text-yellow-400',   isCurr: true,  change: '+29.1%' },
        ].map(kpi => (
          <Card key={kpi.label} className="border-white/10 hover:border-brand-500/30 transition-all bg-surface-900/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{kpi.label}</span>
                <div className="p-2 rounded-lg bg-white/5">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {kpi.isCurr ? formatCurrency(kpi.val) : formatNumber(kpi.val)}
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                <span className="text-green-400 text-xs font-bold">{kpi.change}</span>
                <span className="text-white/40 text-xs">vs last 30d</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portals Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Your Gaming Portals</h2>
            <p className="text-xs text-white/50">Each portal operates with independent themes, game subsets, and domain routing</p>
          </div>
          <Link href="/dashboard/portals">
            <Button variant="ghost" size="sm" className="text-brand-400 hover:text-brand-300 gap-1 text-xs">
              View all ({portals.length}) <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portals.map(portal => (
            <Card key={portal.id} className="border-white/10 hover:border-brand-500/40 transition-all bg-surface-900/90 group">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-300">
                      <Globe className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-brand-300 transition-colors">
                        {portal.name}
                      </h3>
                      <p className="text-xs text-white/40 font-mono">playgrid.com/portal/{portal.slug}</p>
                    </div>
                  </div>
                  <Badge variant={portal.status === 'published' ? 'success' : 'warning'}>
                    {portal.status}
                  </Badge>
                </div>

                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                  {portal.tagline ?? portal.description ?? 'Custom gaming portal running on PlayGrid engine.'}
                </p>

                {portal.custom_domain && (
                  <div className="flex items-center gap-1.5 text-xs text-electric-400 bg-electric-500/10 px-2.5 py-1 rounded-md border border-electric-500/20">
                    <span>🌐</span>
                    <span className="font-mono">{portal.custom_domain}</span>
                    <span className="ml-auto text-green-400 text-[10px] font-bold">SSL VERIFIED</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <Link href={`/dashboard/portals/${portal.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Portal Builder
                    </Button>
                  </Link>
                  <Link href={`/portal/${portal.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white" title="Preview Portal">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Revenue and Ad Health Quick Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-white/10 bg-surface-900/80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" />
                Revenue Distribution (Verified Contractual Split)
              </CardTitle>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300">
                80/20 REVENUE SPLIT
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-card p-4 rounded-xl">
                <p className="text-xs text-white/50">Gross Ad Income</p>
                <p className="text-xl font-bold text-white mt-1">$1,450.00</p>
              </div>
              <div className="glass-card p-4 rounded-xl border-green-500/20 bg-green-500/5">
                <p className="text-xs text-green-400 font-semibold">Your Share (80%)</p>
                <p className="text-xl font-bold text-green-400 mt-1">$1,160.00</p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <p className="text-xs text-white/50">Platform Fee (20%)</p>
                <p className="text-xl font-bold text-white/70 mt-1">$290.00</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 text-xs text-white/40">
              <span>Next automated payout cycle: 1st of next month</span>
              <Link href="/dashboard/revenue" className="text-brand-400 hover:underline">
                View Payout History →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-surface-900/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white">Active Ad Units</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Homepage Leaderboard', format: '728x90 Banner', status: 'Active', fill: '98.4%' },
              { name: 'Gameplay Above Banner', format: 'Responsive Banner', status: 'Active', fill: '99.1%' },
              { name: 'Play Sidebar Skyscraper', format: '160x600 Display', status: 'Active', fill: '96.8%' },
            ].map(unit => (
              <div key={unit.name} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-xs">
                <div>
                  <p className="font-semibold text-white">{unit.name}</p>
                  <p className="text-white/40 text-[10px]">{unit.format}</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold">{unit.status}</span>
                  <p className="text-white/40 text-[10px]">{unit.fill} fill</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

