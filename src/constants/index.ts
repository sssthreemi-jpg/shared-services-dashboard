import { SharedArea, AreaWeight, Grade } from '@/types';

/** 쉐어드 평가 영역 목록 */
export const SHARED_AREAS: SharedArea[] = [
  '회계',
  '자금',
  '세무',
  '구매',
  '인사',
  'IT지원',
  '총무',
  '경영관리',
  '내부통제',
  '보고체계/데이터관리',
];

/** 영역별 가중치 (합계 100%) */
export const AREA_WEIGHTS: AreaWeight[] = [
  { area: '회계', weight: 0.2 },
  { area: '자금', weight: 0.1 },
  { area: '세무', weight: 0.1 },
  { area: '구매', weight: 0.1 },
  { area: '인사', weight: 0.1 },
  { area: 'IT지원', weight: 0.1 },
  { area: '총무', weight: 0.05 },
  { area: '경영관리', weight: 0.1 },
  { area: '내부통제', weight: 0.1 },
  { area: '보고체계/데이터관리', weight: 0.05 },
];

/** 등급 기준 */
export const GRADE_THRESHOLDS: { grade: Grade; min: number }[] = [
  { grade: 'S', min: 90 },
  { grade: 'A', min: 80 },
  { grade: 'B', min: 70 },
  { grade: 'C', min: 60 },
  { grade: 'D', min: 0 },
];

/** 개선 필요 기준값 */
export const IMPROVEMENT_THRESHOLDS = {
  companyOverallMin: 70,
  areaScoreMin: 60,
  delayedTaskMax: 2,
} as const;

/** 등급별 색상 */
export const GRADE_COLORS: Record<Grade, string> = {
  S: '#6366f1', // indigo
  A: '#3b82f6', // blue
  B: '#22c55e', // green
  C: '#f59e0b', // amber
  D: '#ef4444', // red
};

/** 상태별 색상 */
export const STATUS_COLORS: Record<string, string> = {
  '예정': '#94a3b8',
  '진행중': '#3b82f6',
  '완료': '#22c55e',
  '지연': '#ef4444',
};

/** 우선순위 색상 */
export const PRIORITY_COLORS: Record<string, string> = {
  '상': '#ef4444',
  '중': '#f59e0b',
  '하': '#22c55e',
};
