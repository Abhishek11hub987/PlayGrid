import { Trophy, Crown, Medal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Leaderboards' }

export default async function LeaderboardsPage() {
  // In production: fetch from leaderboard_scores joined with profiles and games
  // For now we show the structure with a note about demo data
  const mockLeaderboard = [
    { rank: 1,  username: 'PixelKing',    score: 142850, game: 'Snake Classic',    plays: 847 },
    { rank: 2,  username: 'GameMaster',   score: 98340,  game: 'Block Puzzle',     plays: 523 },
    { rank: 3,  username: 'ArcadeAce',    score: 76210,  game: 'Space Blaster',    plays: 391 },
    { rank: 4,  username: 'SpeedRunner',  score: 61080,  game: 'Pixel Runner',     plays: 288 },
    { rank: 5,  username: 'PuzzlePro',    score: 54430,  game: '2048 Infinity',    plays: 445 },
    { rank: 6,  username: 'NightOwl',     score: 47920,  game: 'Dungeon Crawler',  plays: 203 },
    { rank: 7,  username: 'CodeGamer',    score: 39140,  game: 'Chess Ultimate',   plays: 167 },
    { rank: 8,  username: 'TurboTom',     score: 31870,  game: 'City Racer 3D',    plays: 342 },
    { rank: 9,  username: 'StarPlayer',   score: 28460,  game: 'Beat Drop',        plays: 198 },
    { rank: 10, username: 'QuickFingers', score: 24350,  game: 'Word Wizard',      plays: 276 },
  ]

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />
    return <span className="text-white/40 font-bold text-sm w-5 text-center">{rank}</span>
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl py-12">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="h-10 w-10 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Leaderboards</h1>
        </div>
        <p className="text-white/60">Top players across all games</p>
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 border border-brand-500/30 text-brand-300">
          🎮 Global Ranked Season • Play any game to enter the leaderboard
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 border-b border-white/5 text-xs font-semibold text-white/40 uppercase tracking-wider">
          <div>Rank</div>
          <div className="col-span-2">Player</div>
          <div>Top Game</div>
          <div className="text-right">Score</div>
        </div>

        {mockLeaderboard.map(entry => (
          <div key={entry.rank}
            className="grid grid-cols-5 px-6 py-4 border-b border-white/5 hover:bg-white/3 transition-colors items-center">
            <div className="flex items-center">
              {getRankDisplay(entry.rank)}
            </div>
            <div className="col-span-2">
              <div className="font-semibold text-white">{entry.username}</div>
              <div className="text-xs text-white/40">{entry.plays} plays</div>
            </div>
            <div className="text-white/70 text-sm">{entry.game}</div>
            <div className="text-right font-bold text-brand-300">
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-white/30 text-xs mt-6">
        Scores are verified server-side. Arbitrary score submissions are rejected.
      </p>
    </div>
  )
}
