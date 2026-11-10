'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2, ArrowRight, ArrowLeft, Globe, Palette, Gamepad2, Megaphone,
  Eye, Rocket, Sparkles
} from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  { id: 1, title: 'Profile & Brand', icon: Sparkles },
  { id: 2, title: 'Portal Identity', icon: Globe },
  { id: 3, title: 'Visual Theme', icon: Palette },
  { id: 4, title: 'Select Games', icon: Gamepad2 },
  { id: 5, title: 'Ad Preferences', icon: Megaphone },
  { id: 6, title: 'Launch Preview', icon: Rocket },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [portalName, setPortalName] = useState('CyberPulse Arcade')
  const [portalSlug, setPortalSlug] = useState('cyberpulse')
  const [theme, setTheme] = useState('neon-cyber')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Tracker */}
      <div className="glass-card p-4 rounded-xl flex items-center justify-between overflow-x-auto">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step.id < currentStep ? 'bg-green-500 text-white' :
              step.id === currentStep ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40' :
              'bg-white/10 text-white/40'
            }`}>
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <span className={`text-xs font-semibold hidden md:inline ${
              step.id === currentStep ? 'text-white' : 'text-white/40'
            }`}>
              {step.title}
            </span>
            {idx < STEPS.length - 1 && <span className="text-white/20 px-1 hidden md:inline">→</span>}
          </div>
        ))}
      </div>

      {/* Step Container */}
      <Card className="border-white/10 bg-surface-900/90 shadow-2xl">
        {currentStep === 1 && (
          <div>
            <CardHeader>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300 w-fit">STEP 1 OF 6</span>
              <CardTitle className="text-2xl font-bold text-white">Publisher Profile Setup</CardTitle>
              <CardDescription className="text-white/60">
                Register your media organization or gaming network credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <Label className="text-white/70">Publisher Name</Label>
                <Input defaultValue="PlayGrid Studios" className="mt-1" />
              </div>
              <div>
                <Label className="text-white/70">Publisher Bio / Focus</Label>
                <Input defaultValue="Flagship browser gaming network and indie title publisher" className="mt-1" />
              </div>
              <div className="p-3 rounded-lg bg-surface-950 border border-white/5 flex items-center gap-2 text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Email address verified: admin@playgrid.io</span>
              </div>
            </CardContent>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <CardHeader>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300 w-fit">STEP 2 OF 6</span>
              <CardTitle className="text-2xl font-bold text-white">Name Your First Gaming Portal</CardTitle>
              <CardDescription className="text-white/60">
                Choose a unique web address and tagline for visitors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <Label className="text-white/70">Portal Name</Label>
                <Input value={portalName} onChange={e => { setPortalName(e.target.value); setPortalSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className="mt-1" />
              </div>
              <div>
                <Label className="text-white/70">Portal Subdomain</Label>
                <div className="flex items-center mt-1">
                  <span className="bg-surface-950 border border-r-0 border-white/10 px-3 py-2 text-white/40 font-mono rounded-l-lg h-10 flex items-center">
                    playgrid.com/portal/
                  </span>
                  <Input value={portalSlug} onChange={e => setPortalSlug(e.target.value)} className="rounded-l-none font-mono" />
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <CardHeader>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300 w-fit">STEP 3 OF 6</span>
              <CardTitle className="text-2xl font-bold text-white">Select Visual Theme Preset</CardTitle>
              <CardDescription className="text-white/60">
                Set color palettes and dark mode aesthetic tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {[
                { id: 'dark-navy', name: 'Dark Navy & Electric Blue (Recommended)', p: '#6720ff', a: '#0ea5e9' },
                { id: 'neon-cyber', name: 'Neon Cyberpunk Arcade', p: '#a855f7', a: '#06b6d4' },
                { id: 'emerald-dark', name: 'Emerald Matrix', p: '#10b981', a: '#3b82f6' },
              ].map(t => (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    theme === t.id ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.p }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.a }} />
                    </div>
                    <span className="font-semibold text-white">{t.name}</span>
                  </div>
                  {theme === t.id && <CheckCircle2 className="h-4 w-4 text-brand-400" />}
                </div>
              ))}
            </CardContent>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <CardHeader>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300 w-fit">STEP 4 OF 6</span>
              <CardTitle className="text-2xl font-bold text-white">Curate Initial Games</CardTitle>
              <CardDescription className="text-white/60">
                Pick starter games from the approved PlayGrid HTML5 catalog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {['Pixel Runner', 'Block Puzzle Master', 'Space Blaster 3000', 'Snake Retro X', 'Neon Drift Highway'].map(g => (
                <div key={g} className="p-2.5 rounded-lg border border-brand-500/40 bg-brand-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-400">✓</span>
                    <span className="font-semibold text-white">{g}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Approved</Badge>
                </div>
              ))}
            </CardContent>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <CardHeader>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300 w-fit">STEP 5 OF 6</span>
              <CardTitle className="text-2xl font-bold text-white">Monetization & Advertising Preferences</CardTitle>
              <CardDescription className="text-white/60">
                Configure banner slots and frequency caps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-950 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Homepage Banner (728x90)</span>
                  <Badge variant="success">ENABLED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">In-Game Non-Intrusive Banner</span>
                  <Badge variant="success">ENABLED</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Strict Accidental-Click Prevention</span>
                  <Badge variant="success">ENFORCED</Badge>
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <CardHeader>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300 w-fit">STEP 6 OF 6</span>
              <CardTitle className="text-2xl font-bold text-white">Ready for Launch!</CardTitle>
              <CardDescription className="text-white/60">
                Your portal has been configured with branding, games, and monetization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center mx-auto text-3xl">
                🚀
              </div>
              <h3 className="text-xl font-bold text-white">{portalName} is ready to publish</h3>
              <p className="text-xs text-white/60 max-w-sm mx-auto">
                Visitors can now browse and play games directly at <code className="text-brand-300">playgrid.com/portal/{portalSlug}</code>
              </p>
              <Button onClick={() => router.push('/dashboard/portals')} size="lg" className="gap-2 shadow-lg shadow-brand-500/30">
                Publish & Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="text-white/60"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          {currentStep < 6 && (
            <Button
              size="sm"
              onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
              className="gap-1.5 shadow-md shadow-brand-500/25"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

