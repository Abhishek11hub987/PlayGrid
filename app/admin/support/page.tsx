import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HelpCircle, Mail, MessageSquare, Clock } from 'lucide-react'

export const metadata = { title: 'Publisher Support Desk | Super Admin' }

export default async function AdminSupportPage() {
  const organizations = await repository.getOrganizations()
  const primaryOrgName = organizations[0]?.name || 'PlayGrid Studios'

  const tickets = [
    {
      id: 't-101',
      subject: 'Custom domain DNS verification for arcade-portal.com',
      publisher: primaryOrgName,
      priority: 'Normal',
      status: 'Open',
      date: '1 hour ago',
    },
    {
      id: 't-102',
      subject: 'Phaser 3 HTML5 game canvas score SDK webhook callback',
      publisher: primaryOrgName,
      priority: 'Normal',
      status: 'In Progress',
      date: '4 hours ago',
    },
    {
      id: 't-103',
      subject: 'AdSense header bidding script tag integration check',
      publisher: organizations[1]?.name || 'NovaPlay Interactive',
      priority: 'High',
      status: 'Resolved',
      date: 'Yesterday',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Publisher Support & Ticket Desk</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              SUPER ADMIN
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Technical inquiries, custom domain assistance, and publisher onboarding support.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tickets.map(t => (
          <Card key={t.id} className="border-white/10 bg-surface-900/90 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-brand-400" />
                <h3 className="font-bold text-white text-sm">[{t.id}] {t.subject}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={t.priority === 'Urgent' ? 'destructive' : 'secondary'} className="text-[10px]">
                  {t.priority}
                </Badge>
                <Badge variant={t.status === 'Open' ? 'warning' : 'outline'} className="text-[10px]">
                  {t.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/50 pt-1 border-t border-white/5">
              <span>Publisher: <strong className="text-white">{t.publisher}</strong></span>
              <span>Opened {t.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
