'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// shadcn badge component
const badgeVariants = cva(
  'inline-flex items-center rounded-full text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        primary: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        danger: 'bg-danger/10 text-danger',
        warning: 'bg-warning/10 text-warning',
        secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-[11px]',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, size, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
));

Badge.displayName = 'Badge';

export { Badge };
