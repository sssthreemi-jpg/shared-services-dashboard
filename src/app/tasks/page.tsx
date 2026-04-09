'use client';

import { useCallback } from 'react';
import { getCompanies } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/shared/LoadingState';
import { TaskManagement } from '@/components/tasks/TaskManagement';

export default function TasksPage() {
  const fetcher = useCallback(() => getCompanies(), []);
  const { data: companies, loading, error, refetch } = useApi(fetcher);

  if (loading) return <LoadingState />;
  if (error || !companies) return <ErrorState message={error ?? undefined} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">과제관리</h2>
        <p className="text-sm text-muted-foreground">
          회사별 중점추진과제 현황 및 관리
        </p>
      </div>
      <TaskManagement companies={companies} />
    </div>
  );
}
