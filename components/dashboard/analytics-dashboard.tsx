'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'
import { formatNumber } from '@/lib/utils'
import { TrendingUp, Users, Eye, Gamepad2 } from 'lucide-react'

export interface AnalyticsData {
  pageViews: number
  uniquePlayers: number
  gameSessions: number
  avgSessionLength: string
  timeseries: Array<{ date: string; visits: number; plays: number }>
  topGames: Array<{ name: string; plays: number }>
  devices: Array<{ name: string; value: number; color: string }>
  countries: Array<{ country: string; code: string; share: string; sessions: string }>
}

const DEFAULT_DATA: AnalyticsData = {
  pageViews: 45780,
  uniquePlayers: 12078,
  gameSessions: 19481,
  avgSessionLength: '7m 42s',
  timeseries: [
    { date: 'Day 1', visits: 5120, plays: 2210 },
    { date: 'Day 2', visits: 5890, plays: 2540 },
    { date: 'Day 3', visits: 6240, plays: 2710 },
    { date: 'Day 4', visits: 6810, plays: 2980 },
    { date: 'Day 5', visits: 7150, plays: 3120 },
    { date: 'Day 6', visits: 7890, plays: 3450 },
    { date: 'Today', visits: 6680, plays: 2471 },
  ],
  topGames: [
    { name: '2048 Classic',         plays: 4211 },
    { name: 'Flappy Wings',          plays: 3120 },
    { name: 'Space Blaster 3000',    plays: 2850 },
    { name: 'Brick Breaker Galaxy',  plays: 2340 },
    { name: 'Snake Retro X',         plays: 1980 },
    { name: 'Tower Builder',         plays: 1890 },
    { name: 'Block Puzzle Master',   plays: 1670 },
    { name: 'Pixel Runner',          plays: 1420 },
  ],
  devices: [
    { name: 'Desktop', value: 54, color: '#6720ff' },
    { name: 'Mobile',  value: 38, color: '#0ea5e9' },
    { name: 'Tablet',  value: 8,  color: '#22c55e' },
  ],
  countries: [
    { country: 'United States', code: 'US', share: '38%', sessions: '7,402' },
    { country: 'United Kingdom', code: 'GB', share: '18%', sessions: '3,506' },
    { country: 'Germany', code: 'DE', share: '14%', sessions: '2,727' },
    { country: 'India', code: 'IN', share: '12%', sessions: '2,337' },
    { country: 'Canada', code: 'CA', share: '9%',  sessions: '1,753' },
  ],
}

export function AnalyticsDashboard({ data = DEFAULT_DATA }: { data?: AnalyticsData }) {
  const [range, setRange] = useState('Last 7 days')

  const kpis = [
    { label: 'Page Views',         val: formatNumber(data.pageViews),         change: '+14.2%', icon: Eye,        color: 'text-electric-400' },
    { label: 'Unique Players',     val: formatNumber(data.uniquePlayers),     change: '+11.8%', icon: Users,      color: 'text-brand-400' },
    { label: 'Game Sessions',      val: formatNumber(data.gameSessions),      change: '+18.5%', icon: Gamepad2,   color: 'text-green-400' },
    { label: 'Avg Session Length', val: data.avgSessionLength,                change: '+5.4%',  icon: TrendingUp, color: 'text-yellow-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Publisher Analytics</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 border border-green-500/30 text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE TELEMETRY
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Audience metrics, gameplay engagement, retention, and device telemetry.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-surface-900 border border-white/10 rounded-xl">
          {['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                range === r ? 'bg-brand-500 text-white shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="border-white/10 bg-surface-900/90">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white">{kpi.val}</div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-green-400 mt-2">
                <TrendingUp className="h-3 w-3" />
                <span>{kpi.change}</span>
                <span className="text-white/40 font-normal">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Area Chart */}
        <Card className="lg:col-span-2 border-white/10 bg-surface-900/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white">Engagement Over Time</CardTitle>
            <CardDescription className="text-xs text-white/50">Visitors vs Game Sessions (Live Timeline)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeseries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6720ff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6720ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="plays" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorPlays)" name="Game Plays" />
                  <Area type="monotone" dataKey="visits" stroke="#6720ff" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" name="Visitors" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="border-white/10 bg-surface-900/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white">Device Breakdown</CardTitle>
            <CardDescription className="text-xs text-white/50">Cross-platform distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
              {data.devices.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-white/70">{d.name}</span>
                  </div>
                  <span className="font-bold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Games and Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-surface-900/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white">Top Performing Games</CardTitle>
            <CardDescription className="text-xs text-white/50">Ranked by verified catalog plays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topGames} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="plays" fill="#6720ff" radius={[0, 4, 4, 0]} name="Plays" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-surface-900/90">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-white">Geographic Distribution</CardTitle>
            <CardDescription className="text-xs text-white/50">Top countries by player volume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.countries.map(c => (
              <div key={c.country} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-950/60 border border-white/5 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-white/40">{c.code}</span>
                  <span className="font-semibold text-white">{c.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/50">{c.sessions} plays</span>
                  <span className="font-bold text-brand-300 w-10 text-right">{c.share}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
