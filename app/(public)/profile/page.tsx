import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GameCard } from '@/components/portal/game-card'
import { User, Trophy, Heart, Clock, Award, Star, Settings } from 'lucide-react'

export const metadata = { title: 'Player Profile | PlayGrid' }

export default async function PlayerProfilePage() {
  const { data: allGames } = await repository.getGames({ limit: 8 })

  const achievements = [
    { title: 'First Play', desc: 'Played your first browser game on PlayGrid', icon: '🎮', pts: 10, unlocked: true },
    { title: 'Speed Runner', desc: 'Finished a stage in under 5 minutes', icon: '⚡', pts: 30, unlocked: true },
    { title: 'Game Explorer', desc: 'Played 25 different HTML5 games', icon: '🧭', pts: 50, unlocked: true },
    { title: 'Top of the Board', desc: 'Achieved a top 10 leaderboard ranking', icon: '👑', pts: 100, unlocked: false },
  ]

  return (
    <div className="container mx-auto px-4 max-w-6xl py-10 space-y-8 animate-fade-in">
      {/* Player Header Card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gradient-to-r from-brand-900/40 via-surface-900 to-surface-900">
        <div className="w-24 h-24 rounded-2xl bg-brand-500/20 border-2 border-brand-500/40 flex items-center justify-center text-4xl shadow-xl">
          🕹️
        </div>
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">PixelChampion</h1>
            <Badge variant="success" className="text-xs">PRO GAMER</Badge>
            <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-500/40">Level 14</Badge>
          </div>
          <p className="text-xs text-white/60">Casual arcade enthusiast and high-score chaser · Member since Jan 2026</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-white/70">
            <div><strong className="text-white">142</strong> Games Played</div>
            <div>•</div>
            <div><strong className="text-white">1,240</strong> Total Score Points</div>
            <div>•</div>
            <div><strong className="text-white">3</strong> Achievements Earned</div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="gap-2 text-xs border-white/15">
          <Settings className="h-4 w-4" /> Edit Profile
        </Button>
      </div>

      {/* Achievements Showcase */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Earned Badges & Achievements</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map(a => (
            <Card key={a.title} className={`border bg-surface-900/90 ${
              a.unlocked ? 'border-brand-500/30' : 'border-white/5 opacity-50'
            }`}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="text-2xl p-2 rounded-xl bg-white/5">{a.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-xs">{a.title}</p>
                    <span className="text-[10px] font-bold text-yellow-400">+{a.pts} pts</span>
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{a.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Favorite & Recently Played */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Favorite Games</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allGames.slice(0, 4).map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-electric-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Recently Played</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allGames.slice(4, 8).map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  )
}

