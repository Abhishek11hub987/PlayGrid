'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Maximize2, Minimize2, RotateCcw, Volume2, VolumeX, Gamepad2,
  AlertCircle, Trophy, Sparkles, X, Pause, Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Game } from '@/types'

interface GamePlayerProps { game: Game }

export function GamePlayer({ game }: GamePlayerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [scoreToast, setScoreToast] = useState<{ score: number } | null>(null)
  const [interstitialActive, setInterstitialActive] = useState(false)
  const [interstitialTimer, setInterstitialTimer] = useState(3)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const gameUrl = game.game_url
  const hasGameUrl = !!gameUrl

  const handleLoad = useCallback(() => { setLoading(false); setError(false) }, [])
  const handleError = useCallback(() => { setLoading(false); setError(true) }, [])

  // SDK Handshake via window message
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.data || typeof event.data !== 'object') return
      const { type, payload } = event.data

      if (type === 'PLAYGRID_SCORE_SUBMIT' && payload?.score) {
        setScoreToast({ score: payload.score })
        setTimeout(() => setScoreToast(null), 4000)
      } else if (type === 'PLAYGRID_AD_INTERSTITIAL_REQUEST') {
        setInterstitialActive(true)
        setInterstitialTimer(3)
        const interval = setInterval(() => {
          setInterstitialTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              setInterstitialActive(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  function handleFullscreen() {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {})
    }
  }

  function handleRestart() {
    setLoading(true)
    setError(false)
    if (iframeRef.current && gameUrl) {
      iframeRef.current.src = gameUrl
    }
  }

  function handleMuteToggle() {
    const nextMuted = !muted
    setMuted(nextMuted)
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PLAYGRID_MUTE',
        payload: { muted: nextMuted }
      }, '*')
    }
  }

  return (
    <div className="space-y-4">
      {/* Player container */}
      <div
        ref={containerRef}
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Score Verified Notification Toast */}
        {scoreToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-surface-900/95 border border-yellow-500/40 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 animate-slide-up backdrop-blur-md">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-semibold">
              Score Verified: <strong className="text-yellow-400">{scoreToast.score.toLocaleString()}</strong> pts!
            </span>
          </div>
        )}

        {/* Demo Interstitial Break Overlay */}
        {interstitialActive && (
          <div className="absolute inset-0 bg-surface-950/95 z-40 flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300 mb-3">
              <Sparkles className="h-3 w-3 text-brand-400" /> SPONSORED INTERSTITIAL · NETWORK BREAK
            </span>
            <div className="p-8 rounded-2xl border border-white/10 bg-surface-900/80 max-w-md w-full space-y-4 shadow-2xl">
              <Sparkles className="h-10 w-10 text-brand-400 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-white">Stage Complete!</h3>
              <p className="text-xs text-white/50">Next level loading automatically in {interstitialTimer}s...</p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 transition-all duration-1000"
                  style={{ width: `${((3 - interstitialTimer) / 3) * 100}%` }}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInterstitialActive(false)}
                className="text-xs border-white/20"
              >
                Skip Ad Break
              </Button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && hasGameUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-950 z-10">
            <div className="text-center space-y-4">
              <div className="relative">
                <Gamepad2 className="h-14 w-14 text-brand-400 mx-auto animate-pulse" />
              </div>
              <div>
                <p className="text-white font-bold text-base">{game.title}</p>
                <p className="text-white/40 text-xs mt-1">Starting sandbox session...</p>
              </div>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-950 z-10">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-danger-500 mx-auto" />
              <div>
                <p className="text-white font-semibold">Game failed to load</p>
                <p className="text-white/50 text-xs mt-1">The title may be undergoing maintenance.</p>
              </div>
              <Button onClick={handleRestart} variant="outline" size="sm" className="text-xs">
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Placeholder when no game URL */}
        {!hasGameUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-950">
            <div className="text-center space-y-4 p-8">
              <Gamepad2 className="h-16 w-16 text-brand-400/40 mx-auto" />
              <div>
                <p className="text-white/80 font-bold text-lg">{game.title}</p>
                <p className="text-white/40 text-xs mt-2 max-w-sm mx-auto">
                  This HTML5 title is currently in review in the Super Admin Ingestion Queue.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-xs text-brand-300">
                  <span>🚀</span> Launching Soon
                </div>
              </div>
            </div>
          </div>
        )}

        {/* iframe game */}
        {hasGameUrl && (
          <iframe
            ref={iframeRef}
            src={gameUrl}
            title={game.title}
            className="absolute inset-0 w-full h-full border-0"
            sandbox={game.iframe_sandbox_allow as React.IframeHTMLAttributes<HTMLIFrameElement>['sandbox']}
            allow="fullscreen"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between glass-card rounded-xl px-4 py-2.5 border border-white/5 bg-surface-900/90">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
            <Gamepad2 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-white font-bold text-xs">{game.title}</span>
            {game.category && (
              <span className="text-[10px] text-white/40 ml-2 hidden sm:inline">
                • {game.category.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {hasGameUrl && (
            <>
              <Button variant="ghost" size="icon" onClick={handleRestart} title="Restart Game" className="h-8 w-8 text-white/70 hover:text-white">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleMuteToggle} title={muted ? 'Unmute' : 'Mute'} className="h-8 w-8 text-white/70 hover:text-white">
                {muted ? <VolumeX className="h-3.5 w-3.5 text-red-400" /> : <Volume2 className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleFullscreen} title="Fullscreen" className="h-8 w-8 text-white/70 hover:text-white">
                {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Instructions & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {game.instructions && (
          <div className="glass-card rounded-xl p-4 border border-white/5 space-y-1">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">How to Play</h3>
            <p className="text-xs text-white/70 leading-relaxed">{game.instructions}</p>
          </div>
        )}

        {game.controls && (
          <div className="glass-card rounded-xl p-4 border border-white/5 space-y-1">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Controls</h3>
            <p className="text-xs text-white/70 font-mono">{game.controls}</p>
          </div>
        )}
      </div>
    </div>
  )
}
