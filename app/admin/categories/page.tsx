import { repository } from '@/lib/data/repository'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderTree, Plus, Edit2, Trash2 } from 'lucide-react'

export const metadata = { title: 'Game Categories | Super Admin' }

export default async function AdminCategoriesPage() {
  const categories = await repository.getCategories()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Game Taxonomy & Category System</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
              <FolderTree className="h-3 w-3" /> SUPER ADMIN TAXONOMY ({categories.length})
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Manage global game genres, SEO slugs, icons, and display ordering.
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-2 text-xs shadow-lg shadow-yellow-500/25">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className="border-white/10 bg-surface-900/90 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: `${cat.color}25`, color: cat.color ?? '#a855f7' }}
              >
                🎮
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Order #{cat.sort_order}
              </Badge>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{cat.name}</h3>
              <p className="text-[11px] text-white/50 font-mono mt-0.5">/{cat.slug}</p>
              <p className="text-[11px] text-white/40 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7 text-white/60 hover:text-white">
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

