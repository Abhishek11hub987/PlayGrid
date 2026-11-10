'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flag, CheckCircle2, XCircle, AlertTriangle, Shield, ShieldAlert } from 'lucide-react'

const INITIAL_REPORTS = [
  { id: 'rep-1', targetType: 'game', targetName: 'Shadow Blades Combat', reason: 'Copyright Claim', details: 'DMCA inquiry submitted regarding sound effects pack.', status: 'pending', date: '2026-03-05' },
  { id: 'rep-2', targetType: 'portal', targetName: 'FastGames.xyz', reason: 'Ad Spacing Violation', details: 'Banner detected overlapping gameplay canvas.', status: 'reviewed', date: '2026-03-02' },
]

export default function AdminModerationPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS)

  function resolveReport(id: string, newStatus: 'actioned' | 'dismissed') {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Trust, Safety & Moderation Desk</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <ShieldAlert className="h-3 w-3" /> SUPER ADMIN MODERATION
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Investigate player reports, copyright inquiries, and ad-placement policy infractions.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map(r => (
          <Card key={r.id} className="border-white/10 bg-surface-900/90 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Flag className="h-4 w-4 text-warning-500" />
                <h3 className="font-bold text-white text-sm">Report #{r.id}: {r.reason}</h3>
                <Badge variant="outline" className="text-[10px] uppercase font-mono">{r.targetType}</Badge>
              </div>
              <Badge variant={r.status === 'pending' ? 'warning' : 'secondary'} className="text-[10px] uppercase">
                {r.status}
              </Badge>
            </div>
            <p className="text-xs text-white/70">{r.details}</p>
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/40">
              <span>Target: <strong className="text-white">{r.targetName}</strong></span>
              <div className="flex gap-2">
                {r.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => resolveReport(r.id, 'actioned')} className="h-7 text-[10px] bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                      Take Action
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => resolveReport(r.id, 'dismissed')} className="h-7 text-[10px] border-white/10 text-white/70">
                      Dismiss
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

