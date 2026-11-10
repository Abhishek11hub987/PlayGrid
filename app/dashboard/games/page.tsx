import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gamepad2, Search, Star, ExternalLink, Filter, CheckCircle, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'Game Catalog & Distribution | PlayGrid' }

export default async function PublisherGamesPage() {
  const [{ data: games }] = await Promise.all([
    repository.getGames({ limit: 100 }),
    repository.getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Approved Game Catalog</h1>
          <p className="text-white/60 text-sm mt-1">
            Browse verified HTML5 games ready for distribution across your white-label portals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-green-400 border-green-500/30">
            {games.length} Verified Titles
          </Badge>
          <Link href="/admin/game-uploads">
            <Button className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs gap-1.5 shadow-lg shadow-brand-500/25">
              <UploadCloud className="h-4 w-4" /> Add Distributor Game
            </Button>
          </Link>
        </div>
      </div>

      {/* Game Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {games.map(game => (
          <Card key={game.id} className="border-white/10 hover:border-brand-500/30 transition-all bg-surface-900/90 overflow-hidden group">
            <div className="relative aspect-video bg-surface-950 overflow-hidden">
              <Image
                src={game.thumbnail_url || `/thumbnails/${game.slug}.svg`}
                alt={game.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-[10px] bg-black/60 backdrop-blur-md">
                  {game.category?.name}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-white text-base truncate group-hover:text-brand-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-2 mt-1 leading-relaxed">
                  {game.short_description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-3 w-3 fill-yellow-400" />
                  <span>{game.rating_average.toFixed(1)}</span>
                </div>
                <span>{game.play_count.toLocaleString()} plays</span>
                <span className="capitalize">{game.technology}</span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button size="sm" variant="outline" className="w-full text-xs gap-1.5 border-white/10 hover:bg-white/5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" /> Distributed
                </Button>
                <Link href={`/play/${game.slug}`} target="_blank">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:text-white">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

