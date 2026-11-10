'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

const registerSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email:        z.string().email('Enter a valid email address'),
  password:     z.string().min(8, 'Password must be at least 8 characters'),
  confirm:      z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setServerError(null)
    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email:    data.email,
      password: data.password,
      options: {
        data: { display_name: data.display_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setServerError(error.message)
      return
    }

    if (authData?.user && authData.user.identities && authData.user.identities.length === 0) {
      setServerError('An account with this email already exists. Please sign in with your password.')
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-success-500 mx-auto" />
        <h2 className="text-xl font-semibold text-white">Check your email</h2>
        <p className="text-white/60 text-sm">
          We sent a confirmation link to your email address. Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        {serverError && (
          <div className="flex items-center gap-2 bg-danger-500/10 border border-danger-500/20 rounded-lg px-4 py-3 text-danger-300 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {serverError}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="display_name">Display Name</Label>
          <Input id="display_name" placeholder="GamerTag123" {...register('display_name')} />
          {errors.display_name && <p className="text-danger-300 text-xs">{errors.display_name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
          {errors.email && <p className="text-danger-300 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-danger-300 text-xs">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input id="confirm" type="password" placeholder="••••••••" {...register('confirm')} />
          {errors.confirm && <p className="text-danger-300 text-xs">{errors.confirm.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account...</> : 'Create Account'}
        </Button>
      </div>
    </form>
  )
}
