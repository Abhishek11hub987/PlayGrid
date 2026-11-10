import { repository } from '@/lib/data/repository'
import { PortalsManager } from '@/components/dashboard/portals-manager'

export const metadata = { title: 'Portals Manager | PlayGrid' }

export default async function PortalsPage() {
  const portals = await repository.getPortals()
  return <PortalsManager portals={portals} />
}

