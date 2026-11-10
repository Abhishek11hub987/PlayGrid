'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Globe, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function NewPortalPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [tagline, setTagline] = useState('')
  const [domain, setDomain] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleNameChange(val: string) {
    setName(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      router.push('/dashboard/portals')
    }, 800)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/portals" className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Portals
      </Link>

      <Card className="border-white/10 bg-surface-900/90 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-300">
              <Globe className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300">
              Multi-Tenant Portal Engine
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Create New Gaming Portal</CardTitle>
          <CardDescription className="text-white/60">
            Launch a brand new white-label portal with its own domain, theme, and curated game collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-white/80">Portal Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Neon Arcade Nexus"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-white/80">Subdomain / URL Slug</Label>
              <div className="flex items-center">
                <span className="bg-surface-950 border border-r-0 border-white/15 px-3 py-2 text-xs font-mono text-white/40 rounded-l-lg h-10 flex items-center">
                  playgrid.com/portal/
                </span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="rounded-l-none font-mono text-sm"
                  placeholder="neon-arcade"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline" className="text-white/80">Portal Tagline</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. The fastest browser action and puzzle games online"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="domain" className="text-white/80">Custom Domain (Optional)</Label>
              <Input
                id="domain"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="games.yourcustomdomain.com"
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-white/40">You can also link custom domains later in the Visual Builder.</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <Link href="/dashboard/portals">
                <Button type="button" variant="ghost" className="text-white/70">Cancel</Button>
              </Link>
              <Button type="submit" disabled={submitting || !name} className="gap-2 shadow-lg shadow-brand-500/30">
                {submitting ? 'Generating Portal...' : 'Create & Launch Portal'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

