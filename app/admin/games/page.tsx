import { repository } from '@/lib/data/repository'
import { AdminGamesManager } from '@/components/admin/games-manager'

export const metadata = { title: 'Manage Games | Super Admin' }

export default async function GamesPage() {
  const [{ data: games }, categories] = await Promise.all([
    repository.getGames({ limit: 100 }),
    repository.getCategories(),
  ])

  return <AdminGamesManager initialGames={games} categories={categories} />
}

