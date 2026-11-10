import { Card, CardContent } from '@/components/ui/card'
import { Gamepad2, Globe, Shield, Sparkles } from 'lucide-react'

export const metadata = { title: 'About PlayGrid | Multi-Portal Gaming Network' }

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-14 space-y-10 animate-fade-in text-white">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The Open Gaming Infrastructure</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          About <span className="text-gradient">PlayGrid</span>
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed">
          One platform. Multiple gaming portals. Unlimited possibilities.
        </p>
      </div>

      <div className="glass-card p-8 rounded-2xl border-white/10 space-y-6 text-sm text-white/80 leading-relaxed">
        <h2 className="text-xl font-bold text-white">Our Mission</h2>
        <p>
          PlayGrid was created to solve two fundamental problems in modern web gaming: delivering lightweight, frictionless HTML5 games to billions of players with zero install requirements, and empowering independent digital publishers with enterprise-grade white-label gaming SaaS infrastructure.
        </p>

        <h2 className="text-xl font-bold text-white pt-4">The Dual Ecosystem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-white/10 bg-surface-900/80 p-5 space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-brand-400" /> Public Gaming Network
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Distributing safe, verified browser games across desktop, tablet, and mobile browsers with instant sub-second load times and ethical advertising.
            </p>
          </Card>
          <Card className="border-white/10 bg-surface-900/80 p-5 space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Globe className="h-5 w-5 text-electric-400" /> White-Label SaaS
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Enabling publishers, digital brands, and media creators to launch custom-branded, monetized gaming hubs on their own custom domains.
            </p>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-white pt-4">Safety & Compliance First</h2>
        <p>
          All third-party game embeds execute in hardened HTML5 sandbox containers with strict origin isolation. We safeguard our visitors against intrusive pop-ups, malicious scripts, and unvetted content.
        </p>
      </div>
    </div>
  )
}

