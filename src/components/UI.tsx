'use client';

export { Button } from '@/components/ui/button';
export { Card } from '@/components/ui/card';
export { Badge } from '@/components/ui/badge';
export { Input } from '@/components/ui/input';
export { Select } from '@/components/ui/select';
export { SummaryCard } from '@/components/ui/summary-card';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  const sizeMap = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
  };

  return (
    <div className="flex-center flex-col gap-4">
      <div
        className="spinner"
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderWidth: size === 'sm' ? '1px' : '2px',
        }}
      />
      {text && <p className="text-sm text-muted">{text}</p>}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex-center justify-center align-middle h-[50vh] flex-col gap-4 py-12">
      {icon && <div className="text-4xl opacity-50">{icon}</div>}
      <h3 className="font-semibold text-lg">{title}</h3>
      {description && <p className="text-sm text-muted">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
