'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanies } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/shared/LoadingState';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { CompanyScoreChart } from '@/components/dashboard/CompanyScoreChart';
import { AreaAverageChart } from '@/components/dashboard/AreaAverageChart';
import { TaskOverview } from '@/components/dashboard/TaskOverview';
import { ImprovementAlerts } from '@/components/dashboard/ImprovementAlerts';
import { CompanyTable } from '@/components/dashboard/CompanyTable';

export default function DashboardPage() {
  const router = useRouter();
  const fetcher = useCallback(() => getCompanies(), []);
  const { data: companies, loading, error, refetch } = useApi(fetcher);

  if (loading) return <LoadingState />;
  if (error || !companies) return <ErrorState message={error ?? undefined} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Executive Summary</h2>
        <p className="text-sm text-muted-foreground">쉐어드서비스 운영평가 전체 현황</p>
      </div>

      <ExecutiveSummary companies={companies} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CompanyScoreChart
          companies={companies}
          onCompanyClick={(id) => router.push(`/company/${id}`)}
        />
        <AreaAverageChart companies={companies} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TaskOverview companies={companies} />
        </div>
        <ImprovementAlerts companies={companies} />
      </div>

      <CompanyTable companies={companies} />
    </div>
  );
}
