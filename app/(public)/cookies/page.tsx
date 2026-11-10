export const metadata = { title: 'Cookie Policy | PlayGrid' }

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-14 space-y-6 text-white text-xs leading-relaxed">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white">Cookie & Tracking Policy</h1>
        <p className="text-white/40 mt-1">Transparency on our cookie storage mechanisms.</p>
      </div>

      <div className="space-y-4 text-white/80">
        <p>
          PlayGrid uses strictly necessary cookies to manage authentication sessions, remember game progress and user volume preferences, and monitor portal uptime. Non-essential advertising cookies are gated behind opt-in consent banners in applicable jurisdictions.
        </p>
      </div>
    </div>
  )
}

