import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth/get-user'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-surface-950 text-white overflow-hidden">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-950">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

