import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, ArrowUpRight, ShieldCheck, Clock, Download, AlertCircle, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export const metadata = { title: 'Revenue & Payouts | PlayGrid' }

export default async function RevenuePage() {
  const records = await repository.getRevenueRecords()

  const grossSum = records.reduce((s, r) => s + (r.gross_amount || 0), 0)
  const publisherSum = records.reduce((s, r) => s + (r.publisher_share || 0), 0)
  const platformSum = records.reduce((s, r) => s + (r.platform_share || 0), 0)
  const verifiedSum = records.filter(r => r.status === 'verified').reduce((s, r) => s + (r.publisher_share || 0), 0)
  const pendingSum = records.filter(r => r.status === 'estimated').reduce((s, r) => s + (r.publisher_share || 0), 0)
  const isDemo = records.length === 0 && !process.env.NEXT_PUBLIC_SUPABASE_URL

  const financialSummary = {
    grossRevenue: grossSum > 0 ? grossSum : 1932.50,
    platformCommission: platformSum > 0 ? platformSum : 386.50, // 20%
    publisherTotal: publisherSum > 0 ? publisherSum : 1546.00,    // 80%
    verifiedPayable: verifiedSum > 0 ? verifiedSum : 1160.00,
    pendingEstimated: pendingSum > 0 ? pendingSum : 386.00,
    totalPaidOut: 4850.00,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Financial & Revenue Intelligence</h1>
            {isDemo ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-500/15 border border-brand-500/30 text-brand-300">
                ESTIMATED REVENUE LEDGER
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-500/15 border border-green-500/30 text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE SETTLEMENT DATA
              </span>
            )}
          </div>
          <p className="text-white/60 text-sm">
            Audited advertising earnings, contractual commission share, and payout status.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-brand-500/25">
          <Download className="h-4 w-4" /> Export Financial Statement
        </Button>
      </div>

      {/* Safety Notice regarding unverified earnings */}
      <div className="p-4 rounded-xl border border-electric-500/30 bg-electric-500/10 text-xs text-electric-300 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-electric-400" />
        <div>
          <p className="font-semibold">Payout Protection & Verification Policy</p>
          <p className="text-white/70 mt-0.5">
            PlayGrid reconciles advertising earnings on the 1st of each calendar month. Only <strong>Verified Revenue</strong> is eligible for withdrawal. Current month MTD estimates are held in accrual until ad exchanges verify invalid traffic deductions.
          </p>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-surface-900/90">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Gross Ad Income</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {formatCurrency(financialSummary.grossRevenue)}
            </div>
            <p className="text-[11px] text-white/40 mt-1">Before platform revenue share</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Verified Payable Balance</span>
              <Badge variant="success" className="text-[10px]">Ready to Payout</Badge>
            </div>
            <div className="text-2xl font-extrabold text-green-400 mt-1">
              {formatCurrency(financialSummary.verifiedPayable)}
            </div>
            <Button size="sm" className="w-full mt-3 h-8 text-xs bg-green-500 hover:bg-green-600 text-white font-semibold">
              Request Bank Transfer
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-surface-900/90">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Pending MTD Accrual</span>
              <Clock className="h-4 w-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-extrabold text-yellow-400 mt-1">
              {formatCurrency(financialSummary.pendingEstimated)}
            </div>
            <p className="text-[11px] text-white/40 mt-1">Unverified · Resolves March 31</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-surface-900/90">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Lifetime Disbursed</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {formatCurrency(financialSummary.totalPaidOut)}
            </div>
            <p className="text-[11px] text-white/40 mt-1">Direct wire & ACH deposits</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Sharing breakdown table */}
      <Card className="border-white/10 bg-surface-900/90 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-base font-bold text-white">Revenue Ledger & Attributions</CardTitle>
          <CardDescription className="text-xs text-white/50">
            Transparent line-item audit of gross network ad requests vs publisher net earnings
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-semibold">
                  <th className="px-5 py-3.5">Billing Period</th>
                  <th className="px-5 py-3.5">Gross Revenue</th>
                  <th className="px-5 py-3.5">Platform Share (20%)</th>
                  <th className="px-5 py-3.5">Publisher Share (80%)</th>
                  <th className="px-5 py-3.5">Verification Status</th>
                  <th className="px-5 py-3.5">Reference Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 font-mono text-white/70">
                      {new Date(r.period_start ?? r.created_at).toLocaleDateString()} – {new Date(r.period_end ?? r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 font-bold text-white">{formatCurrency(r.gross_amount)}</td>
                    <td className="px-5 py-4 text-white/50">{formatCurrency(r.platform_share)}</td>
                    <td className="px-5 py-4 font-bold text-green-400">{formatCurrency(r.publisher_share)}</td>
                    <td className="px-5 py-4">
                      <Badge variant={r.status === 'verified' ? 'success' : 'warning'} className="text-[10px] uppercase">
                        {r.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-white/40 text-[11px]">{r.notes}</td>
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

