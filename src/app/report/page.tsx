'use client';

import { useCallback } from 'react';
import { getCompanies } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/shared/LoadingState';
import { ReportSummary } from '@/components/report/ReportSummary';

export default function ReportPage() {
  const fetcher = useCallback(() => getCompanies(), []);
  const { data: companies, loading, error, refetch } = useApi(fetcher);

  if (loading) return <LoadingState />;
  if (error || !companies) return <ErrorState message={error ?? undefined} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <ReportSummary companies={companies} />
    </div>
  );
}
