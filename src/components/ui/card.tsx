'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// shadcn card component
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-3xl border border-border bg-background p-6 shadow-sm shadow-black/5 transition-all',
        hover && 'hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export { Card };
