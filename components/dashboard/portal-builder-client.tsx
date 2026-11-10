'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Monitor, Smartphone, Save, Eye, Palette, Layout, Gamepad2, Globe, Check,
  Sparkles, RefreshCw
} from 'lucide-react'
import type { Portal, Game, GameCategory } from '@/types'

interface PortalBuilderProps {
  portal: Portal
  availableGames: Game[]
  categories: GameCategory[]
}

const THEME_PRESETS = [
  { id: 'dark-navy',   name: 'Dark Navy & Electric Blue', primary: '#6720ff', accent: '#0ea5e9', bg: '#0b0f19' },
  { id: 'neon-cyber',  name: 'Neon Cyberpunk',             primary: '#a855f7', accent: '#06b6d4', bg: '#080512' },
  { id: 'emerald-dark',name: 'Emerald Matrix',            primary: '#10b981', accent: '#3b82f6', bg: '#03140c' },
  { id: 'crimson-fire',name: 'Crimson Flame',              primary: '#ef4444', accent: '#f59e0b', bg: '#140404' },
]

export function PortalBuilderClient({ portal, availableGames, categories }: PortalBuilderProps) {
  const [activeTab, setActiveTab] = useState<'branding' | 'sections' | 'games' | 'domain'>('branding')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [saved, setSaved] = useState(false)

  // Portal form state
  const [name, setName] = useState(portal.name)
  const [tagline, setTagline] = useState(portal.tagline ?? '')
  const [primaryColor, setPrimaryColor] = useState(portal.theme?.primary_color ?? '#6720ff')
  const [accentColor, setAccentColor] = useState(portal.theme?.accent_color ?? '#0ea5e9')
  const [fontPreset, setFontPreset] = useState(portal.theme?.font_preset ?? 'geist')
  const [customDomain, setCustomDomain] = useState(portal.custom_domain ?? '')

  // Homepage sections toggles
  const [sections, setSections] = useState({
    hero: true,
    featured: true,
    categories: true,
    trending: true,
    recent: true,
    leaderboard: true,
    ads: true,
  })

  // Selected game IDs for this portal
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>(
    availableGames.slice(0, 8).map(g => g.id)
  )

  function toggleGame(id: string) {
    setSelectedGameIds(prev =>
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
    )
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/20 text-brand-300">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Visual Builder: {name}
              <Badge variant="outline" className="text-xs">{portal.status}</Badge>
            </h1>
            <p className="text-xs text-white/50">Configure design tokens, active sections, and live preview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex items-center bg-surface-900 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-md transition-colors ${previewDevice === 'desktop' ? 'bg-brand-500 text-white' : 'text-white/40 hover:text-white'}`}
              title="Desktop preview"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-md transition-colors ${previewDevice === 'mobile' ? 'bg-brand-500 text-white' : 'text-white/40 hover:text-white'}`}
              title="Mobile preview"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <Button onClick={handleSave} className="gap-2 shadow-lg shadow-brand-500/30">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Changes Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Config on left, Live Canvas Preview on right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Builder Controls (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          {/* Navigation Tabs */}
          <div className="flex bg-surface-900 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            {[
              { id: 'branding', label: 'Branding', icon: Palette },
              { id: 'sections', label: 'Sections', icon: Layout },
              { id: 'games',    label: 'Games',    icon: Gamepad2 },
              { id: 'domain',   label: 'Domain',   icon: Globe },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                  activeTab === tab.id ? 'bg-brand-500 text-white shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Branding */}
          {activeTab === 'branding' && (
            <Card className="border-white/10 bg-surface-900/90">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white">Identity & Theme Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <Label htmlFor="pName" className="text-white/70">Portal Name</Label>
                  <Input id="pName" value={name} onChange={e => setName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="pTag" className="text-white/70">Tagline</Label>
                  <Input id="pTag" value={tagline} onChange={e => setTagline(e.target.value)} className="mt-1" placeholder="e.g. The Best Retro Arcade" />
                </div>

                <div>
                  <Label className="text-white/70">Curated Presets</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {THEME_PRESETS.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => { setPrimaryColor(p.primary); setAccentColor(p.accent); }}
                        className="text-left p-2.5 rounded-lg border border-white/10 hover:border-brand-500/40 bg-surface-950 flex flex-col gap-1.5 transition-all"
                      >
                        <div className="flex gap-1.5">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent }} />
                        </div>
                        <span className="text-[11px] font-semibold text-white truncate">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <Label className="text-white/70">Primary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-white/80">{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-white/70">Accent Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={e => setAccentColor(e.target.value)}
                        className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-white/80">{accentColor}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: Sections */}
          {activeTab === 'sections' && (
            <Card className="border-white/10 bg-surface-900/90">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white">Homepage Layout Blocks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(sections).map(([key, enabled]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-surface-950/60 border border-white/5">
                    <div>
                      <p className="text-xs font-semibold text-white capitalize">{key} Section</p>
                      <p className="text-[10px] text-white/40">Visible to portal visitors</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSections(prev => ({ ...prev, [key]: !prev[key as keyof typeof sections] }))}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        enabled ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {enabled ? 'ENABLED' : 'HIDDEN'}
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* TAB 3: Games */}
          {activeTab === 'games' && (
            <Card className="border-white/10 bg-surface-900/90">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-white">Catalog Selection</CardTitle>
                  <span className="text-xs text-brand-300 font-bold">{selectedGameIds.length} games selected</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {availableGames.map(g => {
                  const isChecked = selectedGameIds.includes(g.id)
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGame(g.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isChecked ? 'border-brand-500/50 bg-brand-500/10' : 'border-white/5 bg-surface-950/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                          isChecked ? 'bg-brand-500 border-brand-500 text-white' : 'border-white/30'
                        }`}>
                          {isChecked && '✓'}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">{g.title}</p>
                          <p className="text-[10px] text-white/40 capitalize">{g.category?.name ?? 'Game'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{g.play_count.toLocaleString()} plays</Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* TAB 4: Domain */}
          {activeTab === 'domain' && (
            <Card className="border-white/10 bg-surface-900/90">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white">Custom Domain Mapping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <Label htmlFor="domainInput" className="text-white/70">Custom Domain Name</Label>
                  <Input
                    id="domainInput"
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    placeholder="e.g. games.yourbrand.com"
                    className="mt-1 font-mono"
                  />
                  <p className="text-[11px] text-white/40 mt-1">
                    Point your CNAME DNS record to <code className="text-brand-300">cname.playgrid.io</code>
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-surface-950 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">SSL Certificate</span>
                    <span className="text-green-400 font-bold">Auto-Provisioned</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">DNS Verification</span>
                    <span className="text-yellow-400 font-bold">CNAME Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Mockup Canvas (7 cols) */}
        <div className="xl:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-brand-400" /> Live Interactive Preview
            </span>
            <span className="text-[11px] text-white/40">Real-time theme rendering</span>
          </div>

          <div className={`transition-all duration-300 rounded-2xl overflow-hidden border-4 border-surface-800 shadow-2xl bg-surface-950 ${
            previewDevice === 'mobile' ? 'w-[360px] h-[640px]' : 'w-full min-h-[640px]'
          }`}>
            {/* Mock browser top bar */}
            <div className="bg-surface-900 px-4 py-2 border-b border-white/10 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-success-500/60" />
              </div>
              <div className="flex-1 bg-surface-950/80 rounded-md py-1 px-3 text-[10px] text-white/50 font-mono text-center truncate">
                https://{customDomain || `${portal.slug}.playgrid.com`}
              </div>
            </div>

            {/* Portal Page Simulation */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[580px]" style={{
              background: `linear-gradient(180deg, #0a0614 0%, #030712 100%)`
            }}>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: primaryColor }}>
                    🎮
                  </div>
                  <span className="font-bold text-sm text-white">{name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] text-white/60">Games</span>
                  <span className="text-[10px] text-white/60">Search</span>
                </div>
              </div>

              {/* Simulated Hero */}
              {sections.hero && (
                <div className="p-5 rounded-xl border relative overflow-hidden" style={{
                  background: `radial-gradient(ellipse at top, ${primaryColor}30 0%, transparent 70%)`,
                  borderColor: `${primaryColor}40`
                }}>
                  <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>
                    Featured Network
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-1">{tagline || name}</h2>
                  <p className="text-xs text-white/60 mt-1">Play hundreds of free browser games instantly.</p>
                  <button className="mt-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                    ▶ Play Featured
                  </button>
                </div>
              )}

              {/* Simulated Ad Unit */}
              {sections.ads && (
                <div className="h-12 border-2 border-dashed border-white/15 rounded-lg flex items-center justify-center text-[10px] text-white/40">
                  ⚠️ AD PLACEMENT: BANNER 728×90
                </div>
              )}

              {/* Simulated Game Grid */}
              {sections.featured && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-white">🔥 Trending on {name}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {availableGames.filter(g => selectedGameIds.includes(g.id)).slice(0, 4).map(g => (
                      <div key={g.id} className="rounded-lg p-2 bg-surface-900 border border-white/5 space-y-1">
                        <div className="aspect-[4/3] rounded-md bg-surface-800 flex items-center justify-center text-xs">
                          🕹️
                        </div>
                        <p className="text-[11px] font-semibold text-white truncate">{g.title}</p>
                        <p className="text-[9px] text-white/40 capitalize">{g.category?.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

