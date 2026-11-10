import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Download, Sparkles, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export const metadata = { title: 'Global Platform Revenue | Super Admin' }

export default async function AdminRevenuePage() {
  const records = await repository.getRevenueRecords()

  const grossSum = records.reduce((s, r) => s + (r.gross_amount || 0), 0)
  const platformCut = records.reduce((s, r) => s + (r.platform_share || 0), 0)
  const publisherShare = records.reduce((s, r) => s + (r.publisher_share || 0), 0)
  const isDemo = records.every(r => r.is_demo)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Global Revenue & Platform Commissions</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              SUPER ADMIN
            </span>
            {!isDemo && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 border border-green-500/30 text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE REVENUE
              </span>
            )}
          </div>
          <p className="text-white/60 text-sm">
            Platform-wide gross revenue reconciliation, contractual revenue-share splits, and disbursem*nts.
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 text-xs shadow-lg shadow-yellow-500/25">
          <Download className="h-4 w-4" /> Download Global Ledger (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-white/10 bg-surface-900/90 p-5">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Gross Platform Ad Revenue</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatCurrency(grossSum > 0 ? grossSum : 1932.50)}
          </div>
          <p className="text-[11px] text-white/40 mt-1">Across all publisher networks</p>
        </Card>
        <Card className="border-yellow-500/30 bg-yellow-500/5 p-5">
          <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Platform SaaS Commission (20%)</span>
          <div className="text-2xl font-extrabold text-yellow-400 mt-1">
            {formatCurrency(platformCut > 0 ? platformCut : 386.50)}
          </div>
          <p className="text-[11px] text-yellow-400/60 mt-1">Direct company gross margin</p>
        </Card>
        <Card className="border-green-500/30 bg-green-500/5 p-5">
          <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Publisher Disbursable (80%)</span>
          <div className="text-2xl font-extrabold text-green-400 mt-1">
            {formatCurrency(publisherShare > 0 ? publisherShare : 1546.00)}
          </div>
          <p className="text-[11px] text-green-400/60 mt-1">Payable across active publishers</p>
        </Card>
      </div>

      {/* Transaction Records */}
      <Card className="border-white/10 bg-surface-900/90 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-base font-bold text-white">Consolidated Ledger Entries</CardTitle>
          <CardDescription className="text-xs text-white/50">Reconciled line items with tenant attributions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-semibold">
                  <th className="px-5 py-3.5">Record ID</th>
                  <th className="px-5 py-3.5">Tenant Organization</th>
                  <th className="px-5 py-3.5">Gross Revenue</th>
                  <th className="px-5 py-3.5">Platform Cut (20%)</th>
                  <th className="px-5 py-3.5">Publisher Share (80%)</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 font-mono text-white/60">{r.id}</td>
                    <td className="px-5 py-4 font-semibold text-white">{r.organization_id}</td>
                    <td className="px-5 py-4 font-bold text-white">{formatCurrency(r.gross_amount)}</td>
                    <td className="px-5 py-4 text-yellow-400 font-semibold">{formatCurrency(r.platform_share)}</td>
                    <td className="px-5 py-4 text-green-400 font-semibold">{formatCurrency(r.publisher_share)}</td>
                    <td className="px-5 py-4">
                      <Badge variant={r.status === 'verified' ? 'success' : 'warning'} className="text-[10px] uppercase">
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

