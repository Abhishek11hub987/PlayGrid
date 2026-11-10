'use client'

import { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  UploadCloud, CheckCircle, Globe, Gamepad2, Play, Eye,
  Sparkles, ShieldCheck, AlertCircle, RefreshCw, FileArchive, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import type { GameCategory } from '@/types'

interface DistributorPreset {
  name: string
  developer: string
  exampleUrl: string
  exampleThumb: string
  licenseType: string
  badgeColor: string
}

const DISTRIBUTOR_PRESETS: Record<string, DistributorPreset> = {
  gamedistribution: {
    name: 'GameDistribution (Azerion)',
    developer: 'GameDistribution Partner',
    exampleUrl: 'https://html5.gamedistribution.com/39a1c6a2879f425bb2a4a7967812bbbb/?gd_sdk_referrer_url=https://playgrid.io',
    exampleThumb: 'https://img.gamedistribution.com/39a1c6a2879f425bb2a4a7967812bbbb-512x512.jpeg',
    licenseType: 'Azerion Commercial Rev-Share',
    badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
  },
  gamepix: {
    name: 'GamePix',
    developer: 'GamePix Studios',
    exampleUrl: 'https://play.gamepix.com/subway-surfers/embed',
    exampleThumb: 'https://games.gamepix.com/images/icon/subway-surfers.png',
    licenseType: 'GamePix Partner Embed',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
  },
  crazygames: {
    name: 'CrazyGames',
    developer: 'CrazyGames Network',
    exampleUrl: 'https://www.crazygames.com/embed/shell-shockers',
    exampleThumb: 'https://images.crazygames.com/games/shell-shockers/cover-16-9.png',
    licenseType: 'CrazyGames WebGL Partner',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
  },
  famobi: {
    name: 'Famobi',
    developer: 'Famobi GmbH',
    exampleUrl: 'https://play.famobi.com/smart-bubbles',
    exampleThumb: 'https://img.famobi.com/html5games/s/smart-bubbles/v2/thumb.jpg',
    licenseType: 'Famobi HTML5 Licensed',
    badgeColor: 'border-green-500/40 text-green-400 bg-green-500/10',
  },
  custom: {
    name: 'Custom / Self-Hosted',
    developer: 'Independent Studio',
    exampleUrl: 'https://your-game-host.vercel.app/index.html',
    exampleThumb: 'https://picsum.photos/seed/custom-game/600/450',
    licenseType: 'Custom License',
    badgeColor: 'border-white/20 text-white/70 bg-white/5',
  },
}

export function GameUploadsClient({ categories }: { categories: GameCategory[] }) {
  const defaultCat = categories.find(c => c.slug === 'arcade')?.id || categories[0]?.id || 'cat-3'

  const [activeTab, setActiveTab] = useState<'distributor' | 'zip'>('distributor')
  const [selectedPreset, setSelectedPreset] = useState<string>('gamedistribution')

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [gameUrl, setGameUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [category, setCategory] = useState(defaultCat)
  const [developer, setDeveloper] = useState(DISTRIBUTOR_PRESETS.gamedistribution.developer)
  const [description, setDescription] = useState('')
  const [controls, setControls] = useState('Mouse / Keyboard / Touch')
  const [orientation, setOrientation] = useState<'both' | 'landscape' | 'portrait'>('both')
  const [isFeatured, setIsFeatured] = useState(false)

  // File Selection State (Tab 2)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<{ name: string; sizeKb: number } | null>(null)

  // Status & Feedback
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [createdGame, setCreatedGame] = useState<any>(null)
  const [testPreviewOpen, setTestPreviewOpen] = useState(false)

  function applyPreset(key: string) {
    setSelectedPreset(key)
    const p = DISTRIBUTOR_PRESETS[key]
    if (p) {
      setDeveloper(p.developer)
    }
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  function handleFileChosen(file: File | undefined) {
    if (!file) return
    setSelectedFile({
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
    })
    if (!title) {
      const cleanName = file.name.replace(/\.(zip|html|htm)$/i, '').replace(/[-_]+/g, ' ')
      handleTitleChange(cleanName.replace(/\b\w/g, c => c.toUpperCase()))
    }
  }

  async function handlePublishGame(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setCreatedGame(null)

    if (!title.trim()) {
      setErrorMsg('Please enter a game title.')
      return
    }

    if (!gameUrl.trim()) {
      setErrorMsg('Please enter the game embed URL (https://... or /games/...).')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          game_url: gameUrl.trim(),
          thumbnail_url: thumbnailUrl.trim() || undefined,
          category_id: category,
          developer: developer.trim() || 'Game Partner',
          description: description.trim() || `${title.trim()} is a free HTML5 browser game available on PlayGrid.`,
          controls: controls.trim(),
          orientation,
          is_featured: isFeatured,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish game')
      }

      setCreatedGame(data.data)
      setTitle('')
      setSlug('')
      setGameUrl('')
      setThumbnailUrl('')
      setDescription('')
      setIsFeatured(false)
      setTestPreviewOpen(false)
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const activeCategoryName = categories.find(c => c.id === category)?.name || 'Arcade'

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Upload & Ingest Games</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <UploadCloud className="h-3.5 w-3.5" /> SUPER ADMIN INGESTION STUDIO
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Add games from distributors (GameDistribution, GamePix, CrazyGames, Famobi) or prepare self-hosted HTML5 builds.
          </p>
        </div>

        <Link href="/admin/games">
          <Button variant="outline" className="text-xs border-white/10 hover:bg-white/5 gap-1.5">
            <Gamepad2 className="h-4 w-4 text-brand-400" /> View Current Catalog
          </Button>
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('distributor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-100 ${
            activeTab === 'distributor'
              ? 'bg-yellow-500 text-black shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="h-4 w-4" /> Add via Distributor / Embed URL (Recommended)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('zip')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors duration-100 ${
            activeTab === 'zip'
              ? 'bg-yellow-500 text-black shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <UploadCloud className="h-4 w-4" /> Prepare HTML5 File / ZIP Build
        </button>
      </div>

      {/* Success Notification */}
      {createdGame && (
        <div className="p-5 rounded-2xl border border-green-500/30 bg-green-500/10 text-white space-y-3">
          <div className="flex items-center gap-2.5 text-green-400 font-bold text-sm">
            <CheckCircle className="h-5 w-5" />
            <span>Game Successfully Added & Published to All Portals!</span>
          </div>
          <p className="text-xs text-white/70">
            <strong>{createdGame.title}</strong> is now live in the global catalog and linked to your active portals.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <Link href={`/play/${createdGame.slug}`} target="_blank">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black font-bold text-xs gap-1.5">
                <Play className="h-3.5 w-3.5 fill-black" /> Test Play Now
              </Button>
            </Link>
            <Link href="/admin/games">
              <Button size="sm" variant="outline" className="text-xs border-green-500/30 text-green-300 hover:bg-green-500/10">
                Manage in Catalog
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-danger-500/30 bg-danger-500/10 text-xs text-danger-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: DISTRIBUTOR INGESTION STUDIO */}
      {activeTab === 'distributor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-white/10 bg-surface-900">
              <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="h-4 w-4 text-yellow-400" /> Distributor Embed Ingestion
                </CardTitle>
                <CardDescription className="text-xs text-white/50">
                  Select a partner network preset or paste any HTTPS HTML5 game embed link
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-xs text-white/70 block mb-2 font-semibold">
                    1. Select Distributor Network Preset
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(DISTRIBUTOR_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => applyPreset(key)}
                        className={`p-3 rounded-xl border text-left transition-colors duration-100 ${
                          selectedPreset === key
                            ? `${preset.badgeColor} ring-1 ring-yellow-400 font-bold`
                            : 'border-white/10 bg-surface-950/60 text-white/70 hover:border-white/20'
                        }`}
                      >
                        <div className="text-xs truncate">{preset.name}</div>
                        <div className="text-[10px] text-white/40 mt-1 truncate">{preset.licenseType}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handlePublishGame} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-white/80">Game Title *</Label>
                      <Input
                        required
                        value={title}
                        onChange={e => handleTitleChange(e.target.value)}
                        placeholder="e.g. Subway Surfers, Moto X3M"
                        className="bg-surface-950/60 border-white/10 text-white h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white/80">Category / Genre *</Label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-surface-950/60 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id} className="bg-surface-900 text-white">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/80">Game Embed URL (iFrame Source) *</Label>
                      <button
                        type="button"
                        onClick={() => {
                          setGameUrl(DISTRIBUTOR_PRESETS[selectedPreset].exampleUrl)
                          if (!thumbnailUrl) setThumbnailUrl(DISTRIBUTOR_PRESETS[selectedPreset].exampleThumb)
                        }}
                        className="text-[11px] text-yellow-400 hover:underline"
                      >
                        Insert Example URL
                      </button>
                    </div>
                    <Input
                      required
                      value={gameUrl}
                      onChange={e => setGameUrl(e.target.value)}
                      placeholder="https://html5.gamedistribution.com/..."
                      className="bg-surface-950/60 border-white/10 text-white font-mono text-xs h-10"
                    />
                    <p className="text-[10px] text-white/40">
                      Must use https://, http://, or /games/... path. Runs inside PlayGrid&apos;s isolated iframe sandbox.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-white/80">Thumbnail Image URL</Label>
                      <button
                        type="button"
                        onClick={() => setThumbnailUrl(`https://picsum.photos/seed/${encodeURIComponent(title || 'game')}/600/450`)}
                        className="text-[11px] text-brand-400 hover:underline"
                      >
                        Generate Placeholder Cover
                      </button>
                    </div>
                    <Input
                      value={thumbnailUrl}
                      onChange={e => setThumbnailUrl(e.target.value)}
                      placeholder="https://img.gamedistribution.com/..."
                      className="bg-surface-950/60 border-white/10 text-white text-xs h-10 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-white/80">Developer / Distributor Credit</Label>
                      <Input
                        value={developer}
                        onChange={e => setDeveloper(e.target.value)}
                        placeholder="e.g. Azerion / Kiloo"
                        className="bg-surface-950/60 border-white/10 text-white text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-white/80">Orientation</Label>
                      <select
                        value={orientation}
                        onChange={e => setOrientation(e.target.value as 'both' | 'landscape' | 'portrait')}
                        className="w-full h-10 px-3 rounded-lg bg-surface-950/60 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      >
                        <option value="both" className="bg-surface-900">Both / Auto-Responsive</option>
                        <option value="landscape" className="bg-surface-900">Landscape (Desktop / Tablet)</option>
                        <option value="portrait" className="bg-surface-900">Portrait (Mobile Friendly)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-white/80">Gameplay Description</Label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Brief overview of gameplay mechanics, power-ups, and levels..."
                      className="w-full rounded-lg bg-surface-950/60 border border-white/10 text-white text-xs p-3 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-white/80">Controls Guide</Label>
                    <Input
                      value={controls}
                      onChange={e => setControls(e.target.value)}
                      placeholder="e.g. Arrow keys to steer, Spacebar to boost, Tap screen on mobile"
                      className="bg-surface-950/60 border-white/10 text-white text-xs h-10"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={e => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-surface-950 accent-yellow-500"
                    />
                    <span className="text-xs text-white/80">Feature this game on homepage hero &amp; portal highlights</span>
                  </label>

                  <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold text-xs px-6 h-11 gap-2"
                    >
                      {submitting ? (
                        <><RefreshCw className="h-4 w-4 animate-spin" /> Publishing Game...</>
                      ) : (
                        <><Sparkles className="h-4 w-4" /> Publish Game to Network</>
                      )}
                    </Button>

                    {gameUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setTestPreviewOpen(!testPreviewOpen)}
                        className="w-full sm:w-auto border-white/15 hover:bg-white/5 text-xs text-white h-11 gap-1.5"
                      >
                        <Eye className="h-4 w-4 text-brand-400" />
                        {testPreviewOpen ? 'Close Sandbox Test' : 'Test Play in Sandbox'}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {testPreviewOpen && gameUrl && (
              <Card className="border-yellow-500/30 bg-surface-950 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-xs font-bold text-white">Live Sandbox Test Viewer</span>
                    <span className="text-[10px] text-white/40 font-mono truncate max-w-xs">({gameUrl})</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setTestPreviewOpen(false)}
                    className="text-xs text-white/60 hover:text-white"
                  >
                    Close
                  </Button>
                </div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                  <iframe
                    src={gameUrl}
                    title="Live Test Sandbox"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-fullscreen"
                    allow="fullscreen; autoplay"
                  />
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-white/10 bg-surface-900 overflow-hidden">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-white/50">
                  Live Portal Card Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-950 border border-white/10">
                  {thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailUrl}
                      alt={title || 'Game preview'}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.currentTarget.src = 'https://picsum.photos/seed/placeholder/600/450'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/30 space-y-2">
                      <Gamepad2 className="h-10 w-10" />
                      <span className="text-[11px]">Thumbnail preview appears here</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-[10px] bg-black/80">
                      {activeCategoryName}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm truncate">
                    {title || 'Your Game Title'}
                  </h3>
                  <p className="text-[11px] text-white/50 line-clamp-2 mt-1">
                    {description || 'Game description and summary text will display on portal listings...'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 border-t border-white/5">
                  <span>{developer || 'Partner Network'}</span>
                  <span className="text-yellow-400 font-bold">★ 4.8</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-surface-900 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-400" /> Distributor Quick Reference
              </h4>
              <div className="space-y-2 text-white/70 text-[11px]">
                <p>
                  <strong>GameDistribution:</strong> Open your GameDistribution publisher catalog and copy the HTTPS iFrame Embed URL + cover thumbnail URL.
                </p>
                <p>
                  <strong>GamePix:</strong> Copy any embed link (<code className="text-white/90">play.gamepix.com/&lt;slug&gt;/embed</code>) from your partner dashboard.
                </p>
                <p>
                  <strong>Self-Hosted Builds:</strong> Deploy your HTML5 build folder anywhere (Vercel, Netlify Drop, Cloudflare Pages) and paste the HTTPS link here.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: ZIP / FILE HELPER */}
      {activeTab === 'zip' && (
        <Card className="border-white/10 bg-surface-900 p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Self-Hosted HTML5 / ZIP Game Workflow</h2>
            <p className="text-xs text-white/50 mt-1">
              Inspect a local <code className="text-white/80">.zip</code> or <code className="text-white/80">.html</code> build and deploy it safely for Vercel serverless hosting.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,.html,.htm"
            className="hidden"
            onChange={e => handleFileChosen(e.target.files?.[0])}
          />

          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              handleFileChosen(e.dataTransfer.files?.[0])
            }}
            className="p-10 rounded-2xl border-2 border-dashed border-white/15 bg-surface-950/60 text-center space-y-3"
          >
            {selectedFile ? (
              <>
                <FileArchive className="h-12 w-12 text-green-400 mx-auto" />
                <div>
                  <p className="font-bold text-white text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-white/50 mt-1">{selectedFile.sizeKb} KB selected</p>
                </div>
              </>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-yellow-400/70 mx-auto" />
                <div>
                  <p className="font-bold text-white text-sm">Drag &amp; drop a game .zip or index.html file here</p>
                  <p className="text-xs text-white/40 mt-1">Supports HTML5, Phaser, PixiJS, Godot, and Unity WebGL builds</p>
                </div>
              </>
            )}

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-white/20 text-xs"
              >
                {selectedFile ? 'Choose Another File' : 'Browse Files'}
              </Button>

              {selectedFile && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setSelectedPreset('custom')
                    setDeveloper('Self-Hosted Studio')
                    setActiveTab('distributor')
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs gap-1.5"
                >
                  Continue with &ldquo;{title || selectedFile.name}&rdquo; <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200/90 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-yellow-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>How to Host Self-Built HTML5 ZIPs on Vercel</span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/75">
              Because Vercel uses a read-only serverless filesystem, ZIP bundles cannot be unzipped on the server at runtime.
              To deploy a custom game bundle: either drop its folder into <code className="text-white">public/games/&lt;slug&gt;/</code> in Git and push (then enter <code className="text-white">/games/&lt;slug&gt;/index.html</code> in Tab 1),
              or host the extracted folder on a static CDN (Cloudflare Pages, Netlify Drop, itch.io) and paste the HTTPS URL into Tab 1.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
