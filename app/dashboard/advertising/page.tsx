import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Megaphone, Plus, Eye, MousePointer, DollarSign, Settings2, Sparkles, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

export const metadata = { title: 'Advertising Manager | PlayGrid' }

export default async function AdvertisingPage() {
  const placements = await repository.getAdPlacements()
  const portals = await repository.getPortals()

  const adMetrics = {
    impressions: 890400,
    clicks: 14250,
    ctr: '1.60%',
    rpm: '$1.63',
    estEarnings: 1450.00,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Advertising & Monetization Engine</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 border border-green-500/30 text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE AD PLACEMENTS ({placements.length})
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Configure multi-format ad units, frequency caps, and network provider adapters across your portals.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-brand-500/25">
          <Plus className="h-4 w-4" /> New Ad Placement
        </Button>
      </div>

      {/* Ad Policy Disclaimer */}
      <div className="p-4 rounded-xl border border-warning-500/30 bg-warning-500/10 text-xs text-yellow-300 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500" />
        <div>
          <p className="font-semibold">Ethical Monetization & Compliance Standards</p>
          <p className="text-white/70 mt-0.5">
            PlayGrid strictly prohibits intrusive ads that disrupt gameplay or cause accidental clicks. In development mode, mock ad units display clearly-marked demo banners. Live Google AdSense, Media.net, or custom DSP integrations activate only following domain and account policy approvals.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ad Impressions', val: formatNumber(adMetrics.impressions), icon: Eye, color: 'text-electric-400' },
          { label: 'Verified Clicks', val: formatNumber(adMetrics.clicks), icon: MousePointer, color: 'text-brand-400' },
          { label: 'Network CTR', val: adMetrics.ctr, icon: Sparkles, color: 'text-green-400' },
          { label: 'Est. Earnings', val: formatCurrency(adMetrics.estEarnings), icon: DollarSign, color: 'text-yellow-400' },
        ].map(kpi => (
          <Card key={kpi.label} className="border-white/10 bg-surface-900/90">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white">{kpi.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placements Table */}
      <Card className="border-white/10 bg-surface-900/90 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-base font-bold text-white">Active Ad Placements</CardTitle>
          <CardDescription className="text-xs text-white/50">
            Assigned ad units running across portal layouts
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-semibold">
                  <th className="px-5 py-3.5">Placement Name</th>
                  <th className="px-5 py-3.5">Assigned Portal</th>
                  <th className="px-5 py-3.5">Format</th>
                  <th className="px-5 py-3.5">Frequency Limit</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {placements.map(pl => {
                  const portal = portals.find(p => p.id === pl.portal_id)
                  return (
                    <tr key={pl.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4 font-semibold text-white">
                        <div>{pl.name}</div>
                        <div className="font-mono text-[10px] text-white/40">{pl.placement_key}</div>
                      </td>
                      <td className="px-5 py-4 text-white/80">
                        {portal?.name ?? 'Arcade Pulse'}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {pl.ad_format}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-white/60">
                        {pl.frequency_cap > 0 ? `${pl.frequency_cap} / session` : 'Uncapped'}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={pl.is_enabled ? 'success' : 'secondary'} className="text-[10px]">
                          {pl.is_enabled ? 'ACTIVE' : 'DISABLED'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="outline" size="sm" className="text-[10px] h-7 px-2.5">
                          Configure
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

