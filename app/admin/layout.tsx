import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'
import { getAuthUser } from '@/lib/auth/get-user'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) {
    redirect('/login?redirect=/admin')
  }

  if (!user.isSuperAdmin && user.systemRole !== 'super_admin') {
    return (
      <div className="min-h-screen bg-surface-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-card rounded-2xl border border-yellow-500/20 p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7 text-yellow-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Super Admin Access Required</h1>
            <p className="text-xs text-white/60 leading-relaxed">
              You are currently signed in as{' '}
              <strong className="text-white">{user.email || user.profile?.display_name || user.id}</strong>{' '}
              with role <code className="text-yellow-300">{user.systemRole}</code>. Only accounts with{' '}
              <code className="text-yellow-300">super_admin</code> privileges can open the Admin Panel.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full text-xs border-white/15 gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
              </Button>
            </Link>
            <Link href="/login?redirect=/admin" className="flex-1">
              <Button className="w-full text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold gap-1.5">
                <LogIn className="h-3.5 w-3.5" /> Switch Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
