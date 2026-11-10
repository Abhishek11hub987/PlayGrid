import Link from 'next/link'
import { Zap, Compass, Gamepad2, Puzzle, Car, Trophy, Crown, Users, Coffee, GraduationCap } from 'lucide-react'
import type { GameCategory } from '@/types'

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap:           <Zap className="h-6 w-6" />,
  Compass:       <Compass className="h-6 w-6" />,
  Gamepad2:      <Gamepad2 className="h-6 w-6" />,
  Puzzle:        <Puzzle className="h-6 w-6" />,
  Car:           <Car className="h-6 w-6" />,
  Trophy:        <Trophy className="h-6 w-6" />,
  Chess:         <Crown className="h-6 w-6" />,
  Users:         <Users className="h-6 w-6" />,
  Coffee:        <Coffee className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
}

export function CategoryGrid({ categories }: { categories: GameCategory[] }) {
  if (categories.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map(cat => (
          <Link key={cat.id} href={`/category/${cat.slug}`}>
            <div className="glass-card rounded-xl p-4 text-center hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group cursor-pointer">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${cat.color}20`, color: cat.color ?? '#6720ff' }}
              >
                {cat.icon ? (ICON_MAP[cat.icon] ?? <Gamepad2 className="h-6 w-6" />) : <Gamepad2 className="h-6 w-6" />}
              </div>
              <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
