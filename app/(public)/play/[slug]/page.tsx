import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { GamePlayer } from '@/components/portal/game-player'
import { GameCard } from '@/components/portal/game-card'
import { DemoAdBanner } from '@/components/ads/demo-ad-banner'
import type { Game } from '@/types'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('games').select('title').eq('slug', slug).single()
  return { title: data ? `Play ${data.title}` : 'Play Game' }
}

export default async function PlayPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: game } = await supabase
    .from('games')
    .select('*, category:game_categories(*)')
    .eq('slug', slug)
    .eq('approval_status', 'approved')
    .eq('is_active', true)
    .single()

  if (!game) notFound()

  const g = game as Game

  const { data: related } = await supabase
    .from('games')
    .select('*, category:game_categories(*)')
    .eq('category_id', g.category_id ?? '')
    .eq('approval_status', 'approved')
    .eq('is_active', true)
    .neq('id', g.id)
    .limit(4)

  return (
    <div className="container mx-auto px-4 max-w-7xl py-6">
      {/* Demo ad above game - never overlapping or intrusive */}
      <DemoAdBanner placementKey="play_above" className="mb-4" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Game player - takes up 3 columns */}
        <div className="xl:col-span-3">
          <GamePlayer game={g} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <DemoAdBanner placementKey="play_sidebar" orientation="vertical" />

          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              More {g.category?.name} Games
            </h3>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
              {(related ?? [] as Game[]).map((rel: Game) => (
                <GameCard key={rel.id} game={rel} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
