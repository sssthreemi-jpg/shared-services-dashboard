'use client';

import { Company, ImprovementItem } from '@/types';
import { identifyImprovements } from '@/utils/evaluation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  companies: Company[];
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500',
    label: '긴급',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-500',
    label: '주의',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
    label: '참고',
  },
};

export function ImprovementAlerts({ companies }: Props) {
  const items = identifyImprovements(companies);

  // 심각도 순 정렬
  const sortOrder = { critical: 0, warning: 1, info: 2 };
  const sorted = [...items].sort(
    (a, b) => sortOrder[a.severity] - sortOrder[b.severity]
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          개선 필요 항목 ({items.length}건)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {sorted.map((item, i) => {
            const config = severityConfig[item.severity];
            const Icon = config.icon;
            return (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2.5 rounded-md border p-2.5',
                  config.bg,
                  config.border
                )}
              >
                <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', config.iconColor)} />
                <div className="min-w-0">
                  <p className={cn('text-sm font-medium', config.text)}>
                    [{config.label}] {item.companyName}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              개선 필요 항목이 없습니다.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
