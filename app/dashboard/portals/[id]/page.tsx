import { notFound } from 'next/navigation'
import { repository } from '@/lib/data/repository'
import { PortalBuilderClient } from '@/components/dashboard/portal-builder-client'

export const metadata = { title: 'Visual Portal Builder | PlayGrid' }

export default async function PortalBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [portal, gamesRes, categories] = await Promise.all([
    repository.getPortalById(id),
    repository.getGames({ limit: 50 }),
    repository.getCategories(),
  ])
  const allGames = gamesRes.data

  if (!portal) notFound()

  return (
    <PortalBuilderClient
      portal={portal}
      availableGames={allGames}
      categories={categories}
    />
  )
}

