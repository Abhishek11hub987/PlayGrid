import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'PlayGrid — Free Browser Games & White-Label Gaming SaaS', template: '%s | PlayGrid' },
  description: 'Play free HTML5 browser games instantly with zero downloads. Multi-portal network and white-label gaming SaaS platform.',
  keywords: ['free games', 'browser games', 'html5 games', 'online games', 'white label games', 'playgrid'],
  authors: [{ name: 'PlayGrid' }],
  creator: 'PlayGrid',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'PlayGrid',
    title: 'PlayGrid — Free Browser Games & Gaming SaaS',
    description: 'Play free HTML5 browser games instantly.',
  },
  twitter: { card: 'summary_large_image', title: 'PlayGrid', description: 'Free browser games & white-label gaming network.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-950 font-sans antialiased text-white selection:bg-brand-500/30 selection:text-white">
        {children}
      </body>
    </html>
  )
}
