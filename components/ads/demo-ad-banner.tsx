'use client'

import { cn } from '@/lib/utils'

interface DemoAdBannerProps {
  placementKey: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function DemoAdBanner({ placementKey, orientation = 'horizontal', className }: DemoAdBannerProps) {
  if (orientation === 'vertical') {
    return (
      <div className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface-900/60 backdrop-blur-sm w-full',
        'min-h-[250px] p-4 text-center overflow-hidden',
        className
      )}>
        <div className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Advertisement
        </div>
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-3">
          <span className="text-brand-400 font-bold text-xs">AD</span>
        </div>
        <p className="text-white/60 text-xs font-medium">Commercial Display Unit</p>
        <p className="text-white/30 text-[11px] font-mono mt-1">{placementKey} · 160×600</p>
        <div className="mt-3 px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 border border-white/10 text-white/40">
          Programmatic Header Bidding
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'relative flex items-center justify-between rounded-xl border border-white/10 bg-surface-900/60 backdrop-blur-sm w-full h-[90px] px-6 overflow-hidden',
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <span className="text-brand-400 font-bold text-xs">AD</span>
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30 block">
            Sponsored Placement
          </span>
          <p className="text-white/70 text-xs font-medium">Commercial Leaderboard · 728×90</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[11px] font-mono text-white/30 block">{placementKey}</span>
        <span className="text-[10px] text-green-400 font-medium">● Monetization Active</span>
      </div>
    </div>
  )
}
