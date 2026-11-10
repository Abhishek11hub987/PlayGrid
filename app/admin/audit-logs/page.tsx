import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Shield, Clock } from 'lucide-react'

export const metadata = { title: 'Compliance Audit Logs | Super Admin' }

export default async function AdminAuditLogsPage() {
  const logs = await repository.getAuditLogs(100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Security & Governance Audit Trail</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300">
              IMMUTABLE LEDGER
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Cryptographically timestamped log of every administrative action, permission grant, and financial disbursem*nt.
          </p>
        </div>
      </div>

      <Card className="border-white/10 bg-surface-900/90 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-semibold">
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">Actor & Role</th>
                  <th className="px-5 py-3.5">Administrative Action</th>
                  <th className="px-5 py-3.5">Target Resource</th>
                  <th className="px-5 py-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 font-mono text-white/50 text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">
                        {log.actor_id === 'user-super-admin' || (process.env.SUPER_ADMIN_USER_ID && log.actor_id === process.env.SUPER_ADMIN_USER_ID)
                          ? 'Super Admin (Root)'
                          : (log.actor_id ?? 'System Admin')}
                      </div>
                      <Badge variant="outline" className="text-[9px] uppercase font-mono mt-0.5 text-yellow-400 border-yellow-500/30">
                        {log.actor_role ?? 'super_admin'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-mono text-yellow-400 font-bold">
                      {log.action}
                    </td>
                    <td className="px-5 py-4 text-white/80">
                      <span className="capitalize font-semibold">{log.resource_type}</span>
                      {log.resource_id && <span className="font-mono text-[10px] text-white/40 ml-1.5">({log.resource_id})</span>}
                    </td>
                    <td className="px-5 py-4 font-mono text-white/40 text-[11px]">
                      {log.ip_address ?? '127.0.0.1'}
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

