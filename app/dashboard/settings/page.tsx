import { getAuthUser } from '@/lib/auth/get-user'
import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Zap, Shield, Sparkles, Building2 } from 'lucide-react'

export const metadata = { title: 'Publisher Settings & Plans | PlayGrid' }

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    portals: '1 Portal',
    games: '50 Games / Portal',
    features: ['Standard HTML5 game catalog', 'Basic analytics dashboard', 'PlayGrid co-branding', 'Community support'],
    current: false,
  },
  {
    name: 'Starter',
    price: '$29/mo',
    portals: '3 Portals',
    games: '100 Games / Portal',
    features: ['Custom branding & logo', 'Standard analytics with retention', 'Ad revenue sharing enabled', 'Email support'],
    current: false,
  },
  {
    name: 'Pro',
    price: '$79/mo',
    portals: '10 Portals',
    games: '500 Games / Portal',
    features: ['Custom domain mapping (SSL included)', 'Visual portal builder with theme presets', 'Advanced audience analytics', 'Up to 10 team member seats', 'Priority 24/7 SLA'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: '$299/mo',
    portals: 'Unlimited',
    games: 'Full Global Library',
    features: ['Dedicated high-throughput CDN', 'Custom DSP advertising integrations', 'Dedicated account manager', 'White-glove migration & setup'],
    current: false,
  },
]

export default async function SettingsPage() {
  const [user, organizations] = await Promise.all([
    getAuthUser(),
    repository.getOrganizations(),
  ])

  const currentOrg = organizations[0] ?? {
    name: 'PlayGrid Studios',
    website: 'https://playgrid.io',
    description: 'Official flagship gaming portal network publisher on PlayGrid',
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Publisher Account & Subscription</h1>
        <p className="text-white/60 text-sm mt-1">Manage publisher profile, plan limits, and authentication credentials.</p>
      </div>

      {/* Profile Card */}
      <Card className="border-white/10 bg-surface-900/90">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-400" /> Organization Profile
          </CardTitle>
          <CardDescription className="text-xs text-white/50">Details displayed on public portal footers and legal attribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-white/70">Company / Organization Name</Label>
              <Input defaultValue={currentOrg.name} className="mt-1" />
            </div>
            <div>
              <Label className="text-white/70">Business Website</Label>
              <Input defaultValue={currentOrg.website || 'https://playgrid.io'} className="mt-1" />
            </div>
            <div>
              <Label className="text-white/70">Primary Contact Email</Label>
              <Input defaultValue={user?.email || 'admin@playgrid.io'} className="mt-1" />
            </div>
            <div>
              <Label className="text-white/70">Publisher Tier</Label>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="success" className="text-xs">PRO TIER ACTIVE</Badge>
                <span className="text-white/40 text-[11px]">Next renewal: April 1, 2026</span>
              </div>
            </div>
          </div>
          <Button size="sm" className="mt-2 text-xs">Update Profile</Button>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">Subscription Tier & Capacity Limits</h2>
          <p className="text-xs text-white/50">Scale your white-label portal network as audience traffic grows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <Card key={plan.name} className={`border transition-all bg-surface-900/90 flex flex-col ${
              plan.current ? 'border-brand-500 shadow-lg shadow-brand-500/20' : 'border-white/10 hover:border-white/20'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{plan.name}</h3>
                  {plan.current && <Badge variant="default" className="text-[10px]">CURRENT</Badge>}
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">{plan.price}</div>
                <p className="text-[11px] text-brand-300 font-semibold">{plan.portals}</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col justify-between text-xs pt-2">
                <ul className="space-y-2 text-white/70">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-1.5 text-[11px] leading-tight">
                      <Check className="h-3.5 w-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button
                    variant={plan.current ? 'outline' : 'default'}
                    size="sm"
                    className="w-full text-xs"
                    disabled={plan.current}
                  >
                    {plan.current ? 'Active Plan' : 'Switch Plan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
