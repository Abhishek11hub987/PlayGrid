import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Megaphone, Plus, Settings, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Ad Providers & DSP Adapters | Super Admin' }

const AD_PROVIDERS = [
  {
    name: 'PlayGrid Demo Provider Adapter',
    slug: 'demo',
    status: 'Active (Local Dev)',
    type: 'In-House Mock Engine',
    description: 'Generates compliant, non-invasive demo ad cards without tracking artificial impressions or clicks.',
    isProduction: false,
  },
  {
    name: 'Google AdSense MCM / H5 Games Ads',
    slug: 'google-adsense',
    status: 'Adapter Ready (Needs Pub ID)',
    type: 'Display & Interstitial',
    description: 'Direct integration with Google AdSense for Web Games API. Activates once Google approves publisher domain.',
    isProduction: true,
  },
  {
    name: 'Media.net Header Bidding',
    slug: 'media-net',
    status: 'Adapter Ready (Needs Site ID)',
    type: 'Contextual & Native Display',
    description: 'Header bidding wrapper for premium Yahoo! Bing network contextual placements.',
    isProduction: true,
  },
  {
    name: 'Unity Ads for WebGL',
    slug: 'unity-ads',
    status: 'Configurable',
    type: 'Rewarded Video & Interstitial',
    description: 'Voluntary rewarded video integration for games with optional player revival rewards.',
    isProduction: true,
  },
]

export default function AdminAdProvidersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Ad Networks & DSP Provider Adapters</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <Megaphone className="h-3 w-3" /> SUPER ADMIN AD ENGINE
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Provider-independent advertising architecture. Switch or chain monetization partners without altering game code.
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 text-xs shadow-lg shadow-yellow-500/25">
          <Plus className="h-4 w-4" /> Add Provider Adapter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {AD_PROVIDERS.map(p => (
          <Card key={p.slug} className="border-white/10 bg-surface-900/90 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{p.name}</h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">adapter: {p.slug}</p>
              </div>
              <Badge variant={p.isProduction ? 'outline' : 'warning'} className="text-[10px]">
                {p.status}
              </Badge>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              {p.description}
            </p>

            <div className="p-3 rounded-lg bg-surface-950 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-white/40">Supported Formats:</span>
              <span className="text-brand-300 font-semibold">{p.type}</span>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
              <Button size="sm" variant="outline" className="text-xs border-white/10">
                Configure Keys
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

