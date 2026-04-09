'use client';

import { use, useCallback } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCompany, getCompanies } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/shared/LoadingState';
import { CompanyHeader } from '@/components/company/CompanyHeader';
import { AreaScoreTable } from '@/components/company/AreaScoreTable';
import { CompanyRadarChart } from '@/components/company/CompanyRadarChart';
import { CompanyTaskList } from '@/components/company/CompanyTaskList';
import { CompanySummary } from '@/components/company/CompanySummary';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const companyFetcher = useCallback(() => getCompany(id), [id]);
  const allFetcher = useCallback(() => getCompanies(), []);

  const { data: company, loading: loadingOne, error: errorOne, refetch } = useApi(companyFetcher);
  const { data: allCompanies, loading: loadingAll } = useApi(allFetcher);

  if (loadingOne || loadingAll) return <LoadingState />;
  if (errorOne) return <ErrorState message={errorOne} onRetry={refetch} />;
  if (!company || !allCompanies) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            대시보드
          </Button>
        </Link>
      </div>

      <CompanyHeader company={company} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AreaScoreTable areaScores={company.areaScores} />
        <CompanyRadarChart company={company} allCompanies={allCompanies} />
      </div>

      <CompanyTaskList tasks={company.tasks} />

      <CompanySummary company={company} />
    </div>
  );
}
