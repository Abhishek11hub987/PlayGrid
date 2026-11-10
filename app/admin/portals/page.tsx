import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, ExternalLink, Settings, ShieldCheck, Pause, Trash2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Global Portals Fleet | Super Admin' }

export default async function AdminPortalsPage() {
  const portals = await repository.getPortals()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Global Portal Network Fleet</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <Globe className="h-3 w-3" /> SUPER ADMIN FLEET ({portals.length} PORTALS)
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Supervise all white-label portals, custom DNS verification, and hosting status across tenants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {portals.map(portal => (
          <Card key={portal.id} className="border-white/10 bg-surface-900/90 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{portal.name}</h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">/{portal.slug}</p>
              </div>
              <Badge variant={portal.status === 'published' ? 'success' : 'warning'}>
                {portal.status}
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-surface-950 border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Domain:</span>
                <span className="font-mono text-electric-400">{portal.custom_domain ?? 'playgrid.com/portal/' + portal.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Tenant Org ID:</span>
                <span className="font-mono text-brand-300">{portal.organization_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">SSL Status:</span>
                <span className="text-green-400 font-bold">Encrypted (TLS 1.3)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <Link href={`/portal/${portal.slug}`} target="_blank" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-white/10">
                  <ExternalLink className="h-3.5 w-3.5" /> Visit Portal
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

