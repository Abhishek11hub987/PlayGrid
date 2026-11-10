import { RegisterForm } from '@/components/auth/register-form'
import { Gamepad2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gaming flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="bg-brand-500 rounded-lg p-2">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Play<span className="text-brand-400">Grid</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/60 mt-2">Start playing free games today</p>
        </div>
        <RegisterForm />
        <p className="text-center text-white/50 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300">
            Sign in
          </Link>
        </p>
        <p className="text-center text-white/30 text-xs mt-4">
          By registering, you agree to our{' '}
          <Link href="/terms" className="underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
