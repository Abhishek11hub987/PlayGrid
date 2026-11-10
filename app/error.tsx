'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('PlayGrid runtime error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-white/60">
            {error?.message || 'An unexpected error occurred while rendering the page.'}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Try again
          </Button>
          <Link href="/">
            <Button variant="default" className="gap-2">
              <Home className="h-4 w-4" /> Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

