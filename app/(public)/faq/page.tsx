import { Card, CardContent } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

export const metadata = { title: 'Frequently Asked Questions | PlayGrid' }

const FAQS = [
  { q: 'Is playing games on PlayGrid completely free?', a: 'Yes! All HTML5 browser games on PlayGrid are 100% free to play. You do not need to download or install any native executables, apps, or plugins.' },
  { q: 'Can I play on my mobile phone or tablet?', a: 'Absolutely. The PlayGrid platform and our HTML5 game catalog are built with responsive mobile and touch controls that automatically scale to any screen size.' },
  { q: 'What is the PlayGrid Publisher White-Label SaaS?', a: 'PlayGrid SaaS allows digital creators, media companies, and community owners to build and deploy their own branded gaming portals on their own custom domains, choosing from our approved game library and generating ad revenue.' },
  { q: 'How does advertising revenue sharing work?', a: 'When visitors view and interact with ethical ads on your white-label portals, ad network earnings are split according to transparent contractual terms (e.g. 80% to the publisher, 20% platform infrastructure fee).' },
  { q: 'How do you prevent malicious games and ad spam?', a: 'All games must pass super-admin code review, origin verification, and execute inside restricted HTML5 iframe sandboxes. We enforce strict anti-accidental click guidelines.' },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 max-w-3xl py-14 space-y-8 animate-fade-in text-white">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Frequently Asked Questions</h1>
        <p className="text-white/60 text-sm">Everything you need to know about PlayGrid gaming & publisher SaaS.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <Card key={i} className="border-white/10 bg-surface-900/90 p-5 space-y-2">
            <h3 className="font-bold text-white text-base flex items-start gap-2">
              <span className="text-brand-400 font-mono">Q:</span> {faq.q}
            </h3>
            <p className="text-xs text-white/70 pl-6 leading-relaxed">
              {faq.a}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}

