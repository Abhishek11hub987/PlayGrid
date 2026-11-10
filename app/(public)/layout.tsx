import { PublicNav } from '@/components/portal/public-nav'
import { PublicFooter } from '@/components/portal/public-footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gaming flex flex-col">
      <PublicNav />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
