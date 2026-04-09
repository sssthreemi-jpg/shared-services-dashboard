'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success';
}

const variantStyles = {
  default: 'border-l-4 border-l-blue-500',
  warning: 'border-l-4 border-l-amber-500',
  danger: 'border-l-4 border-l-red-500',
  success: 'border-l-4 border-l-green-500',
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
  variant = 'default',
}: KpiCardProps) {
  return (
    <Card className={cn(variantStyles[variant], 'hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            {trend && trendValue && (
              <p
                className={cn(
                  'text-xs font-medium',
                  trend === 'up' && 'text-green-600',
                  trend === 'down' && 'text-red-600',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              >
                {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '─'} {trendValue}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-muted p-2.5">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
