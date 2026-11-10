import { LoginForm } from '@/components/auth/login-form'
import { Gamepad2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gaming flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="bg-brand-500 rounded-lg p-2 group-hover:bg-brand-400 transition-colors">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Play<span className="text-brand-400">Grid</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/60 mt-2">Sign in to your PlayGrid account</p>
        </div>
        <LoginForm />
        <p className="text-center text-white/50 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-400 hover:text-brand-300">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
