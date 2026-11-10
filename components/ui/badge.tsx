import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-brand-500/20 text-brand-300 border border-brand-500/30',
        secondary:   'bg-surface-800 text-surface-100 border border-surface-700',
        destructive: 'bg-danger-500/20 text-danger-300 border border-danger-500/30',
        success:     'bg-success-500/20 text-green-300 border border-success-500/30',
        warning:     'bg-warning-500/20 text-yellow-300 border border-warning-500/30',
        outline:     'border border-white/20 text-white/80',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
