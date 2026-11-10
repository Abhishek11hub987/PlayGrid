import { repository } from '@/lib/data/repository'
import { AdminPublishersManager } from '@/components/admin/publishers-manager'

export const metadata = { title: 'Manage Publishers | Super Admin' }

export default async function PublishersPage() {
  const organizations = await repository.getOrganizations()
  return <AdminPublishersManager initialOrganizations={organizations} />
}

