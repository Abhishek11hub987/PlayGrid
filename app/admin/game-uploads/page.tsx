import { repository } from '@/lib/data/repository'
import { GameUploadsClient } from '@/components/admin/game-uploads-client'

export const metadata = { title: 'Upload & Ingest Games | Super Admin' }

export default async function GameUploadsPage() {
  const categories = await repository.getCategories()
  return <GameUploadsClient categories={categories} />
}
