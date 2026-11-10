import { getAuthUser } from '@/lib/auth/get-user'
import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, Shield, Mail, MoreVertical } from 'lucide-react'

export const metadata = { title: 'Team & Access Permissions | PlayGrid' }

export default async function TeamPage() {
  const [user, portals, orgs] = await Promise.all([
    getAuthUser(),
    repository.getPortals(),
    repository.getOrganizations(),
  ])

  const currentOrg = orgs[0] ?? { name: 'PlayGrid Studios' }
  const portalSummary = portals.length > 0
    ? `All Portals (${portals.length}: ${portals.map(p => p.name).join(', ')})`
    : 'All Portals'

  const members = [
    {
      id: user?.id || 'owner-1',
      name: user?.profile?.display_name || 'Studio Admin',
      email: user?.email || 'admin@playgrid.io',
      role: 'Owner & Super Admin',
      portals: portalSummary,
      status: 'Active',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Management & Access Controls</h1>
          <p className="text-white/60 text-sm mt-1">
            Collaborators for <strong className="text-white">{currentOrg.name}</strong> with role-based access for portal configuration, game publishing, and revenue viewing.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-brand-500/25">
          <UserPlus className="h-4 w-4" /> Invite Team Member
        </Button>
      </div>

      <Card className="border-white/10 bg-surface-900/90 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-base font-bold text-white">Active Organization Members</CardTitle>
          <CardDescription className="text-xs text-white/50">1 of 10 member seats utilized on Pro Plan</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/40 uppercase font-semibold">
                  <th className="px-5 py-3.5">Member</th>
                  <th className="px-5 py-3.5">Assigned Role</th>
                  <th className="px-5 py-3.5">Portal Access</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-white/40 text-[11px] font-mono">{m.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="text-[10px] text-brand-300 border-brand-500/30">
                        {m.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-white/70 max-w-xs truncate">{m.portals}</td>
                    <td className="px-5 py-4">
                      <Badge variant="success" className="text-[10px]">
                        {m.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
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
