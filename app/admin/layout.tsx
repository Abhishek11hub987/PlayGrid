import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth/get-user'
import { AdminSidebar } from '@/components/admin/sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user || (!user.isSuperAdmin && user.systemRole !== 'super_admin')) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-surface-950 text-white overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-950">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

