import Link from 'next/link'
import Image from 'next/image'
import { Play, Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Game } from '@/types'

interface HeroSectionProps {
  featuredGames: Game[]
}

export function HeroSection({ featuredGames }: HeroSectionProps) {
  const hero = featuredGames[0]
  const heroThumb = hero?.thumbnail_url || `/thumbnails/${hero?.slug ?? 'pixel-runner'}.svg`

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gaming" />
      <div className="absolute inset-0 bg-hero-glow" />

      <div className="relative container mx-auto px-4 max-w-7xl py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm text-brand-300">
              <Zap className="h-4 w-4" />
              <span>Free HTML5 Games — No Download Needed</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Play the{' '}
              <span className="text-gradient">Best Browser</span>
              {' '}Games Free
            </h1>

            <p className="text-lg text-white/70 max-w-lg">
              Hundreds of free HTML5 games across every genre. Play instantly
              in your browser — action, puzzle, racing, strategy and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/games">
                <Button size="xl" variant="glow" className="gap-3">
                  <Play className="h-5 w-5 fill-white" />
                  Browse All Games
                </Button>
              </Link>
              <Link href="/search">
                <Button size="xl" variant="outline" className="gap-3">
                  <Search className="h-5 w-5" />
                  Search Games
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: featured game card */}
          {hero && (
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden gradient-border shadow-2xl shadow-brand-500/20">
                <Image
                  src={heroThumb}
                  alt={hero.title}
                  width={600}
                  height={400}
                  className="object-cover w-full"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white/60 text-sm mb-1">Featured Game</p>
                  <h2 className="text-2xl font-bold text-white mb-3">{hero.title}</h2>
                  <Link href={`/play/${hero.slug}`}>
                    <Button variant="electric" className="gap-2">
                      <Play className="h-4 w-4 fill-white" />
                      Play Now
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Floating game thumbnails */}
              {featuredGames.slice(1, 3).map((g, i) => (
                <Link key={g.id} href={`/game/${g.slug}`}
                  className={`absolute ${i === 0 ? '-top-6 -right-6' : '-bottom-4 -left-6'} w-24 h-18 rounded-xl overflow-hidden border-2 border-brand-500/30 shadow-xl hover:scale-110 transition-transform`}
                >
                  <Image
                    src={g.thumbnail_url || `/thumbnails/${g.slug}.svg`}
                    alt={g.title}
                    width={96}
                    height={72}
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
