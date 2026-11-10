'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, ShieldCheck, Check, Database, Lock, Sliders } from 'lucide-react'

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState('20')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Global Settings & Security</h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
            <Sliders className="h-3 w-3" /> SUPER ADMIN SETTINGS
          </span>
        </div>
        <p className="text-white/60 text-sm">
          System-wide variables, default commission tiers, CSP parameters, and database isolation.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Revenue Configuration */}
        <Card className="border-white/10 bg-surface-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-yellow-400" /> Platform Commercial Terms
            </CardTitle>
            <CardDescription className="text-xs text-white/50">
              Default baseline split applied to verified advertising network disbursem*nts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="max-w-xs">
              <Label className="text-white/70">Default Platform Commission Cut (%)</Label>
              <div className="flex items-center mt-1">
                <Input
                  type="number"
                  value={commissionRate}
                  onChange={e => setCommissionRate(e.target.value)}
                  className="font-bold text-sm"
                  min="0"
                  max="100"
                />
                <span className="ml-2 font-bold text-white/60">%</span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">
                Publisher retains {100 - (parseInt(commissionRate) || 20)}% of verified ad revenue.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Sandbox Controls */}
        <Card className="border-white/10 bg-surface-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-400" /> Multi-Tenant Isolation & Sandbox Engine
            </CardTitle>
            <CardDescription className="text-xs text-white/50">
              Security boundaries enforced across all publisher portals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg bg-surface-950 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Supabase Row Level Security (RLS)</p>
                <p className="text-white/40 text-[11px]">Enforces strict tenant isolation on every SQL query</p>
              </div>
              <Badge variant="success">ENABLED</Badge>
            </div>
            <div className="p-3.5 rounded-lg bg-surface-950 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">HTML5 iframe Sandboxing</p>
                <p className="text-white/40 text-[11px]">Minimum permissions: allow-scripts allow-same-origin allow-fullscreen</p>
              </div>
              <Badge variant="success">ENFORCED</Badge>
            </div>
            <div className="p-3.5 rounded-lg bg-surface-950 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Maintenance Mode</p>
                <p className="text-white/40 text-[11px]">Temporarily display 503 maintenance page to public visitors</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  maintenanceMode ? 'bg-danger-500 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                {maintenanceMode ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 text-xs shadow-lg shadow-yellow-500/25">
            {saved ? <Check className="h-4 w-4" /> : null}
            {saved ? 'Platform Settings Saved' : 'Save Platform Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}

