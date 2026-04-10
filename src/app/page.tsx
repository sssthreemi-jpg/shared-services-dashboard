'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Company } from '@/types';
import { getCompanies } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { LoadingState, ErrorState } from '@/components/shared/LoadingState';
import { ExcelToolbar } from '@/components/excel/ExcelToolbar';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { CompanyScoreChart } from '@/components/dashboard/CompanyScoreChart';
import { AreaAverageChart } from '@/components/dashboard/AreaAverageChart';
import { TaskOverview } from '@/components/dashboard/TaskOverview';
import { ImprovementAlerts } from '@/components/dashboard/ImprovementAlerts';
import { CompanyTable } from '@/components/dashboard/CompanyTable';

export default function DashboardPage() {
  const router = useRouter();
  const fetcher = useCallback(() => getCompanies(), []);
  const { data: apiData, loading, error, refetch } = useApi(fetcher);

  // 엑셀 업로드 시 교체할 데이터
  const [uploadedData, setUploadedData] = useState<Company[] | null>(null);

  if (loading) return <LoadingState />;
  if (error || !apiData) return <ErrorState message={error ?? undefined} onRetry={refetch} />;

  // 업로드된 데이터가 있으면 우선 사용, 없으면 API 데이터
  const companies = uploadedData ?? apiData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Executive Summary</h2>
          <p className="text-sm text-muted-foreground">쉐어드서비스 운영평가 전체 현황</p>
        </div>
        {uploadedData && (
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => setUploadedData(null)}
          >
            기본 데이터로 복원
          </button>
        )}
      </div>

      <ExcelToolbar companies={companies} onDataUploaded={setUploadedData} />

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
