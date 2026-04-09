// 쉐어드서비스 평가 대시보드 타입 정의

/** 쉐어드 평가 영역 */
export type SharedArea =
  | '회계'
  | '자금'
  | '세무'
  | '구매'
  | '인사'
  | 'IT지원'
  | '총무'
  | '경영관리'
  | '내부통제'
  | '보고체계/데이터관리';

/** 평가 등급 */
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

/** 과제 상태 */
export type TaskStatus = '예정' | '진행중' | '완료' | '지연';

/** 과제 우선순위 */
export type Priority = '상' | '중' | '하';

/** 과제 구분 */
export type TaskCategory = '개선과제' | '신규구축' | '운영안정화' | '제도정비';

/** 영역별 평가 점수 */
export interface AreaScore {
  area: SharedArea;
  score: number;
}

/** 중점추진과제 */
export interface Task {
  id: string;
  companyId: string;
  companyName: string;
  taskName: string;
  category: TaskCategory;
  area: SharedArea;
  priority: Priority;
  assignee: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: TaskStatus;
  expectedEffect: string;
  risk: string;
  note: string;
}

/** 회사 평가 데이터 */
export interface Company {
  id: string;
  name: string;
  areaScores: AreaScore[];
  overallScore: number;
  grade: Grade;
  previousScore: number | null;
  tasks: Task[];
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  summary: string;
}

/** 개선 필요 항목 */
export interface ImprovementItem {
  companyId: string;
  companyName: string;
  reason: string;
  type: 'company' | 'area' | 'task';
  severity: 'critical' | 'warning' | 'info';
  area?: SharedArea;
  taskId?: string;
}

/** 보고용 요약 행 */
export interface ReportRow {
  companyName: string;
  overallScore: number;
  grade: Grade;
  strengths: string;
  weaknesses: string;
  keyTasks: string;
  risks: string;
  opinion: string;
}

/** 영역 가중치 설정 */
export interface AreaWeight {
  area: SharedArea;
  weight: number;
}
