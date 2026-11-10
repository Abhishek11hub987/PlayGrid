'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)
    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email:    data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    const rawRedirect = new URLSearchParams(window.location.search).get('redirect')
    const target = rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/'
    window.location.assign(target)
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-danger-300 text-xs">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className="text-danger-300 text-xs">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</> : 'Sign In'}
        </Button>
      </div>
    </form>
  )
}
