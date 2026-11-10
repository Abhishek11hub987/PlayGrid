'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Gamepad2, Menu, X, User, LogIn, LayoutDashboard, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Games',       href: '/games' },
  { label: 'Categories',  href: '/category/action' },
  { label: 'Leaderboards', href: '/leaderboards' },
  { label: 'Search',      href: '/search' },
]

export function PublicNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface-950/95">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-brand-500 rounded-lg p-2 group-hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/30">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Play<span className="text-brand-400">Grid</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link key={link.href} href={link.href}>
                  <span className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}>
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <Link href="/search" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>

            {/* Shortcuts to Publisher & Super Admin */}
            <Link href="/dashboard" className="hidden md:flex">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-white/70 hover:text-white border border-white/10">
                <LayoutDashboard className="h-3.5 w-3.5 text-brand-400" />
                Publisher SaaS
              </Button>
            </Link>

            <Link href="/admin" className="hidden md:flex">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-yellow-400/90 hover:text-yellow-300 border border-yellow-500/20 bg-yellow-500/5">
                <Shield className="h-3.5 w-3.5 text-yellow-400" />
                Admin Panel
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden md:flex gap-1.5 text-white/80">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>

            <Link href="/register">
              <Button size="sm" variant="default" className="hidden md:flex font-semibold">
                Get Started
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-2 animate-fade-in">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                <div className={cn(
                  'px-3.5 py-2.5 rounded-lg text-sm font-medium',
                  pathname === link.href ? 'text-white bg-white/10' : 'text-white/70 hover:text-white'
                )}>
                  {link.label}
                </div>
              </Link>
            ))}
            <div className="border-t border-white/5 pt-3 space-y-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block">
                <div className="px-3.5 py-2 rounded-lg text-sm text-brand-300 flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Publisher Dashboard
                </div>
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="block">
                <div className="px-3.5 py-2 rounded-lg text-sm text-yellow-400 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Super Admin Panel
                </div>
              </Link>
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

