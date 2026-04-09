import { AreaScore, Grade, Company, ImprovementItem, ReportRow, SharedArea } from '@/types';
import { AREA_WEIGHTS, GRADE_THRESHOLDS, IMPROVEMENT_THRESHOLDS, SHARED_AREAS } from '@/constants';

/** 가중치 적용 종합점수 계산 */
export function calculateOverallScore(areaScores: AreaScore[]): number {
  let total = 0;
  for (const { area, score } of areaScores) {
    const w = AREA_WEIGHTS.find((aw) => aw.area === area);
    if (w) total += score * w.weight;
  }
  return Math.round(total * 10) / 10;
}

/** 점수 → 등급 변환 */
export function getGrade(score: number): Grade {
  for (const { grade, min } of GRADE_THRESHOLDS) {
    if (score >= min) return grade;
  }
  return 'D';
}

/** 점수 변화량 */
export function getScoreDelta(current: number, previous: number | null): number | null {
  if (previous === null) return null;
  return Math.round((current - previous) * 10) / 10;
}

/** 개선 필요 항목 자동 도출 */
export function identifyImprovements(companies: Company[]): ImprovementItem[] {
  const items: ImprovementItem[] = [];
  const areaAverages = getAreaAverages(companies);

  for (const company of companies) {
    // 종합점수 70점 미만
    if (company.overallScore < IMPROVEMENT_THRESHOLDS.companyOverallMin) {
      items.push({
        companyId: company.id,
        companyName: company.name,
        reason: `종합점수 ${company.overallScore}점 (기준 ${IMPROVEMENT_THRESHOLDS.companyOverallMin}점 미만)`,
        type: 'company',
        severity: 'critical',
      });
    }

    // 특정 영역 60점 미만
    for (const as of company.areaScores) {
      if (as.score < IMPROVEMENT_THRESHOLDS.areaScoreMin) {
        items.push({
          companyId: company.id,
          companyName: company.name,
          reason: `${as.area} 영역 ${as.score}점 (기준 ${IMPROVEMENT_THRESHOLDS.areaScoreMin}점 미만)`,
          type: 'area',
          severity: 'critical',
          area: as.area,
        });
      }
    }

    // 지연 과제 2건 이상
    const delayedTasks = company.tasks.filter((t) => t.status === '지연');
    if (delayedTasks.length >= IMPROVEMENT_THRESHOLDS.delayedTaskMax) {
      items.push({
        companyId: company.id,
        companyName: company.name,
        reason: `지연 과제 ${delayedTasks.length}건`,
        type: 'task',
        severity: 'warning',
      });
    }

    // 핵심 영역 평균이 전체 평균보다 낮은 회사
    for (const as of company.areaScores) {
      const avg = areaAverages.get(as.area) ?? 0;
      if (as.score < avg - 10) {
        items.push({
          companyId: company.id,
          companyName: company.name,
          reason: `${as.area} 영역이 전체 평균(${avg.toFixed(1)}점) 대비 ${(avg - as.score).toFixed(1)}점 낮음`,
          type: 'area',
          severity: 'warning',
          area: as.area,
        });
      }
    }

    // 과제는 많으나 진행률이 낮은 회사
    const activeTasks = company.tasks.filter((t) => t.status !== '완료');
    if (activeTasks.length >= 3) {
      const avgProgress =
        activeTasks.reduce((sum, t) => sum + t.progress, 0) / activeTasks.length;
      if (avgProgress < 30) {
        items.push({
          companyId: company.id,
          companyName: company.name,
          reason: `진행중 과제 ${activeTasks.length}건, 평균 진행률 ${avgProgress.toFixed(0)}%`,
          type: 'task',
          severity: 'warning',
        });
      }
    }
  }

  return items;
}

/** 영역별 전체 평균 계산 */
export function getAreaAverages(companies: Company[]): Map<SharedArea, number> {
  const map = new Map<SharedArea, number>();
  for (const area of SHARED_AREAS) {
    const scores = companies.map(
      (c) => c.areaScores.find((a) => a.area === area)?.score ?? 0
    );
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    map.set(area, Math.round(avg * 10) / 10);
  }
  return map;
}

/** 보고용 요약 테이블 데이터 생성 */
export function generateReportRows(companies: Company[]): ReportRow[] {
  return companies.map((c) => ({
    companyName: c.name,
    overallScore: c.overallScore,
    grade: c.grade,
    strengths: c.strengths.join(', '),
    weaknesses: c.weaknesses.join(', '),
    keyTasks: c.tasks
      .filter((t) => t.priority === '상')
      .map((t) => t.taskName)
      .join(', '),
    risks: c.risks.join(', '),
    opinion: c.summary,
  }));
}
