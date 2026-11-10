import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:     'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25',
        destructive: 'bg-danger-500 text-white hover:bg-danger-600',
        outline:     'border border-white/20 bg-transparent text-white hover:bg-white/10',
        secondary:   'bg-surface-800 text-white hover:bg-surface-700',
        ghost:       'hover:bg-white/10 text-white',
        link:        'text-brand-400 underline-offset-4 hover:underline',
        electric:    'bg-electric-500 text-white hover:bg-electric-600 shadow-lg shadow-electric-500/25',
        glow:        'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/40 animate-glow-pulse',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm:      'h-8 px-3 text-xs',
        lg:      'h-12 px-8 text-base',
        xl:      'h-14 px-10 text-lg',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
