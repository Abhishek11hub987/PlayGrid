import Link from 'next/link'
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react'

const FOOTER_LINKS = {
  Games: [
    { label: 'All Games',      href: '/games' },
    { label: 'Action',         href: '/category/action' },
    { label: 'Puzzle',         href: '/category/puzzle' },
    { label: 'Racing',         href: '/category/racing' },
    { label: 'Strategy',       href: '/category/strategy' },
    { label: 'Arcade',         href: '/category/arcade' },
  ],
  Platform: [
    { label: 'Publisher SaaS', href: '/dashboard' },
    { label: 'Super Admin',    href: '/admin' },
    { label: 'Leaderboards',   href: '/leaderboards' },
    { label: 'About PlayGrid', href: '/about' },
    { label: 'Contact Support',href: '/contact' },
    { label: 'FAQ',            href: '/faq' },
  ],
  Legal: [
    { label: 'Privacy Policy',      href: '/privacy' },
    { label: 'Terms of Service',    href: '/terms' },
    { label: 'Cookie Policy',       href: '/cookies' },
    { label: 'Community Guidelines',href: '/guidelines' },
  ],
}

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 bg-surface-950 mt-20">
      <div className="container mx-auto px-4 max-w-7xl py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-500 rounded-lg p-2 shadow-lg shadow-brand-500/20">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Play<span className="text-brand-400">Grid</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Multi-portal browser gaming network & white-label SaaS platform. Host, distribute, and monetize HTML5 games with zero friction.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/40 pt-2">
              <ShieldCheck className="h-4 w-4 text-green-400" />
              <span>Safe iframe sandbox · COPPA/GDPR conscious</span>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase text-white/80">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/60 text-sm hover:text-brand-300 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} PlayGrid Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>Free-tier optimized architecture</span>
            <span>•</span>
            <span>Modular SaaS engine</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

