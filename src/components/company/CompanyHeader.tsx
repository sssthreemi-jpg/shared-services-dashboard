'use client';

import { Company } from '@/types';
import { GradeBadge } from '@/components/shared/GradeBadge';
import { getScoreDelta } from '@/utils/evaluation';
import { cn } from '@/lib/utils';

interface Props {
  company: Company;
}

export function CompanyHeader({ company }: Props) {
  const delta = getScoreDelta(company.overallScore, company.previousScore);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
          <GradeBadge grade={company.grade} size="lg" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          종합점수 <span className="font-bold text-slate-900">{company.overallScore}점</span>
          {delta !== null && (
            <span
              className={cn(
                'ml-2 font-medium',
                delta > 0 && 'text-green-600',
                delta < 0 && 'text-red-600'
              )}
            >
              (전기 대비 {delta > 0 ? '+' : ''}{delta}점)
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-muted-foreground">강점 영역</p>
          <p className="font-medium text-green-700">
            {company.strengths.length > 0 ? company.strengths.join(', ') : '-'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">보완 영역</p>
          <p className="font-medium text-red-700">
            {company.weaknesses.length > 0 ? company.weaknesses.join(', ') : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
