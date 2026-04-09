'use client';

import { Company } from '@/types';
import { KpiCard } from '@/components/shared/KpiCard';
import { identifyImprovements } from '@/utils/evaluation';
import {
  Building2,
  TrendingUp,
  Trophy,
  AlertTriangle,
  ListTodo,
  Clock,
} from 'lucide-react';

interface Props {
  companies: Company[];
}

export function ExecutiveSummary({ companies }: Props) {
  const avgScore =
    companies.reduce((s, c) => s + c.overallScore, 0) / companies.length;
  const sorted = [...companies].sort((a, b) => b.overallScore - a.overallScore);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const allTasks = companies.flatMap((c) => c.tasks);
  const inProgress = allTasks.filter((t) => t.status === '진행중').length;
  const delayed = allTasks.filter((t) => t.status === '지연').length;

  const improvements = identifyImprovements(companies);
  const criticalCompanies = new Set(
    improvements.filter((i) => i.severity === 'critical').map((i) => i.companyId)
  ).size;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        title="평가 대상 회사"
        value={`${companies.length}개`}
        icon={Building2}
      />
      <KpiCard
        title="평균 종합점수"
        value={avgScore.toFixed(1)}
        subtitle="100점 만점"
        icon={TrendingUp}
        variant="default"
      />
      <KpiCard
        title="최고 점수"
        value={`${best.overallScore}점`}
        subtitle={best.name}
        icon={Trophy}
        variant="success"
      />
      <KpiCard
        title="진행중 과제"
        value={`${inProgress}건`}
        subtitle={`전체 ${allTasks.length}건`}
        icon={ListTodo}
      />
      <KpiCard
        title="지연 과제"
        value={`${delayed}건`}
        icon={Clock}
        variant={delayed > 0 ? 'warning' : 'default'}
      />
      <KpiCard
        title="긴급 개선 필요"
        value={`${criticalCompanies}개사`}
        icon={AlertTriangle}
        variant={criticalCompanies > 0 ? 'danger' : 'default'}
      />
    </div>
  );
}
