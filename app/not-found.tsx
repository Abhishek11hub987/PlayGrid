import Link from 'next/link'
import { Gamepad2, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400">
          <Gamepad2 className="h-8 w-8" />
        </div>
        <div>
          <span className="text-6xl font-black text-brand-400">404</span>
          <h2 className="text-2xl font-bold text-white mt-2">Game Over — Page Not Found</h2>
          <p className="text-sm text-white/60 mt-1">
            The page you are looking for doesn't exist or has moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button variant="default" className="gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
          </Link>
          <Link href="/games">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" /> Browse Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

