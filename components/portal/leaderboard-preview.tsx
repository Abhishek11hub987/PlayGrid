import Link from 'next/link'
import { Trophy, ArrowRight, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'

// In production, this fetches from leaderboard_scores joined with profiles and games
// For the homepage preview, we show a placeholder
export function LeaderboardPreview() {
  const demoEntries = [
    { rank: 1, name: 'PixelKing',   score: 142850, game: 'Snake Classic',    avatar: '👑' },
    { rank: 2, name: 'GameMaster',  score: 98340,  game: 'Block Puzzle',     avatar: '🎮' },
    { rank: 3, name: 'ArcadeAce',   score: 76210,  game: 'Space Blaster',    avatar: '🚀' },
    { rank: 4, name: 'SpeedRunner', score: 61080,  game: 'Pixel Runner',     avatar: '⚡' },
    { rank: 5, name: 'PuzzlePro',   score: 54430,  game: '2048 Infinity',    avatar: '🧩' },
  ]

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Top Players</h2>
        </div>
        <Link href="/leaderboards">
          <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
            Full leaderboard <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="glass-card rounded-xl divide-y divide-white/5">
        {demoEntries.map(entry => (
          <div key={entry.rank} className="flex items-center gap-4 px-6 py-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
              entry.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
              entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
              'bg-white/5 text-white/40'
            }`}>
              {entry.rank === 1 ? <Crown className="h-4 w-4" /> : entry.rank}
            </div>
            <div className="text-2xl">{entry.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{entry.name}</div>
              <div className="text-xs text-white/50">{entry.game}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-brand-300">{entry.score.toLocaleString()}</div>
              <div className="text-xs text-white/40">pts</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
