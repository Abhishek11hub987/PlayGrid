export const metadata = { title: 'Terms of Service | PlayGrid' }

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-14 space-y-6 text-white text-xs leading-relaxed">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white">Terms of Service</h1>
        <p className="text-white/40 mt-1">Last Updated: March 2026 · Demo legal template requiring counsel review.</p>
      </div>

      <div className="space-y-4 text-white/80">
        <h2 className="text-base font-bold text-white pt-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the PlayGrid gaming network, websites, APIs, or white-label portal SaaS services, you agree to be bound by these Terms of Service.
        </p>

        <h2 className="text-base font-bold text-white pt-2">2. Game Distribution & Intellectual Property</h2>
        <p>
          All games hosted or cataloged on PlayGrid are distributed under verified license from their respective rights-holders, original proprietary creation, or authorized open-source releases. Publishers may not scrape, pirate, or reverse-engineer game assets.
        </p>

        <h2 className="text-base font-bold text-white pt-2">3. Publisher Conduct & Ad Fraud Prohibitions</h2>
        <p>
          Publishers using the white-label platform agree never to artificially inflate advertising impressions, generate automated bot traffic, or disguise ad units as gameplay controls. Violation results in immediate portal suspension and balance forfeiture.
        </p>

        <h2 className="text-base font-bold text-white pt-2">4. Revenue Sharing & Disbursem*nt</h2>
        <p>
          Estimated revenues represent unverified projections. Pay-outs occur exclusively following exchange audit reconciliation.
        </p>
      </div>
    </div>
  )
}

