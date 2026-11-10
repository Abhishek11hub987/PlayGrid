export const metadata = { title: 'Privacy Policy | PlayGrid' }

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-14 space-y-6 text-white text-xs leading-relaxed">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-white/40 mt-1">Last Updated: March 2026 · Requires legal review prior to commercial production.</p>
      </div>

      <div className="space-y-4 text-white/80">
        <h2 className="text-base font-bold text-white pt-2">1. Overview & Privacy Principles</h2>
        <p>
          PlayGrid is committed to protecting the privacy and personal data of our visitors, registered gamers, and white-label publishers. We collect only the data necessary to provide seamless game sessions, account progress, and aggregate performance telemetry.
        </p>

        <h2 className="text-base font-bold text-white pt-2">2. Information We Collect</h2>
        <p>
          - <strong>Guest Gameplay:</strong> We assign an anonymous, privacy-preserving session token to monitor game performance and prevent abuse. No personal identification is required for guest play.
        </p>
        <p>
          - <strong>Registered Players:</strong> When you register an account, we store your email address, chosen display name, avatar preferences, and game achievements.
        </p>
        <p>
          - <strong>Publishers:</strong> We collect business contact details, organization name, payout banking references, and domain verification records.
        </p>

        <h2 className="text-base font-bold text-white pt-2">3. Advertising & Cookies</h2>
        <p>
          We partner with vetted ad networks to deliver non-intrusive display banners. In compliant jurisdictions (GDPR/CCPA/ePrivacy), advertising cookies and personalized identifiers are only activated upon explicit user consent.
        </p>

        <h2 className="text-base font-bold text-white pt-2">4. Children’s Privacy (COPPA)</h2>
        <p>
          PlayGrid does not knowingly solicit or collect personally identifiable information from children under 13 years of age. Designated educational and casual kids portals operate without behavioral tracking.
        </p>
      </div>
    </div>
  )
}

