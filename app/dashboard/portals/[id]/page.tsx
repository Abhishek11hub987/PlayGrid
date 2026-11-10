import { notFound } from 'next/navigation'
import { repository } from '@/lib/data/repository'
import { PortalBuilderClient } from '@/components/dashboard/portal-builder-client'

export const metadata = { title: 'Visual Portal Builder | PlayGrid' }

export default async function PortalBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const portal = await repository.getPortalById(id)
  const allGames = (await repository.getGames({ limit: 50 })).data
  const categories = await repository.getCategories()

  if (!portal) notFound()

  return (
    <PortalBuilderClient
      portal={portal}
      availableGames={allGames}
      categories={categories}
    />
  )
}

