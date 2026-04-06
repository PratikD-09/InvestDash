'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// shadcn summary card component
export interface SummaryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  variant?: 'primary' | 'success' | 'danger' | 'warning';
  color?: 'primary' | 'success' | 'danger' | 'warning';
}

const SummaryCard = React.forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ className, title, value, subtitle, trend, variant, color, ...props }, ref) => {
    const themeVariant = variant ?? color ?? 'primary';

    return (
      <Card ref={ref} className={cn('space-y-4', className)} {...props}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
          <Badge variant={themeVariant}>
            {trend !== undefined ? `${trend >= 0 ? '+' : ''}${trend}%` : 'Live'}
          </Badge>
        </div>
      </Card>
    );
  }
);

SummaryCard.displayName = 'SummaryCard';

export { SummaryCard };
