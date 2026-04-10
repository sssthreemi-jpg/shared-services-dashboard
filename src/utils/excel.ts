import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Company, Task, AreaScore, SharedArea } from '@/types';
import { SHARED_AREAS, AREA_WEIGHTS } from '@/constants';
import { calculateOverallScore, getGrade, generateReportRows } from '@/utils/evaluation';

// ─── 다운로드 ───

/** 회사별 평가 데이터를 엑셀로 다운로드 */
export function downloadEvaluationExcel(companies: Company[]) {
  const wb = XLSX.utils.book_new();

  // 시트1: 종합 현황
  const summaryData = companies.map((c) => ({
    회사명: c.name,
    종합점수: c.overallScore,
    등급: c.grade,
    전기점수: c.previousScore ?? '-',
    강점영역: c.strengths.join(', '),
    보완영역: c.weaknesses.join(', '),
    총평: c.summary,
  }));
  const ws1 = XLSX.utils.json_to_sheet(summaryData);
  ws1['!cols'] = [
    { wch: 14 }, { wch: 10 }, { wch: 6 }, { wch: 10 },
    { wch: 30 }, { wch: 30 }, { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, '종합현황');

  // 시트2: 영역별 점수
  const areaData = companies.map((c) => {
    const row: Record<string, string | number> = { 회사명: c.name };
    for (const area of SHARED_AREAS) {
      const score = c.areaScores.find((a) => a.area === area)?.score ?? 0;
      row[area] = score;
    }
    row['종합점수'] = c.overallScore;
    row['등급'] = c.grade;
    return row;
  });
  const ws2 = XLSX.utils.json_to_sheet(areaData);
  XLSX.utils.book_append_sheet(wb, ws2, '영역별점수');

  // 시트3: 과제 목록
  const taskData = companies.flatMap((c) =>
    c.tasks.map((t) => ({
      회사명: t.companyName,
      과제명: t.taskName,
      구분: t.category,
      영역: t.area,
      우선순위: t.priority,
      담당자: t.assignee,
      시작일: t.startDate,
      종료예정일: t.endDate,
      '진행률(%)': t.progress,
      상태: t.status,
      기대효과: t.expectedEffect,
      리스크: t.risk,
      비고: t.note,
    }))
  );
  const ws3 = XLSX.utils.json_to_sheet(taskData);
  ws3['!cols'] = [
    { wch: 14 }, { wch: 30 }, { wch: 12 }, { wch: 20 },
    { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
    { wch: 10 }, { wch: 8 }, { wch: 30 }, { wch: 30 }, { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, '중점추진과제');

  // 시트4: 경영진 보고용
  const reportRows = generateReportRows(companies);
  const reportData = reportRows.map((r) => ({
    회사명: r.companyName,
    종합점수: r.overallScore,
    등급: r.grade,
    강점영역: r.strengths,
    보완영역: r.weaknesses,
    중점추진과제: r.keyTasks,
    주요리스크: r.risks,
    종합의견: r.opinion,
  }));
  const ws4 = XLSX.utils.json_to_sheet(reportData);
  ws4['!cols'] = [
    { wch: 14 }, { wch: 10 }, { wch: 6 }, { wch: 30 },
    { wch: 30 }, { wch: 40 }, { wch: 30 }, { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, ws4, '경영진보고용');

  // 파일 저장
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, `쉐어드서비스_운영평가_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/** 업로드용 템플릿 다운로드 */
export function downloadTemplate() {
  const wb = XLSX.utils.book_new();

  // 시트1: 영역별 점수 입력 템플릿
  const header = ['회사명', ...SHARED_AREAS, '전기점수'];
  const sampleRow = ['(회사명 입력)', ...SHARED_AREAS.map(() => ''), ''];
  const ws1 = XLSX.utils.aoa_to_sheet([header, sampleRow]);
  ws1['!cols'] = header.map((h) => ({ wch: Math.max(h.length * 2, 12) }));
  XLSX.utils.book_append_sheet(wb, ws1, '영역별점수');

  // 시트2: 가중치 참고
  const weightData = AREA_WEIGHTS.map((w) => ({
    영역: w.area,
    '가중치(%)': w.weight * 100,
  }));
  const ws2 = XLSX.utils.json_to_sheet(weightData);
  XLSX.utils.book_append_sheet(wb, ws2, '가중치참고');

  // 시트3: 과제 입력 템플릿
  const taskHeader = [
    '회사명', '과제명', '구분', '영역', '우선순위',
    '담당자', '시작일', '종료예정일', '진행률(%)', '상태',
    '기대효과', '리스크', '비고',
  ];
  const taskSample = [
    '(회사명)', '(과제명)', '개선과제', '회계', '상',
    '(담당자)', '2026-01-01', '2026-06-30', '0', '예정',
    '', '', '',
  ];
  const ws3 = XLSX.utils.aoa_to_sheet([taskHeader, taskSample]);
  ws3['!cols'] = taskHeader.map((h) => ({ wch: Math.max(h.length * 2, 12) }));
  XLSX.utils.book_append_sheet(wb, ws3, '중점추진과제');

  // 시트4: 입력 가이드
  const guideData = [
    ['항목', '설명'],
    ['구분', '개선과제 / 신규구축 / 운영안정화 / 제도정비'],
    ['영역', SHARED_AREAS.join(' / ')],
    ['우선순위', '상 / 중 / 하'],
    ['상태', '예정 / 진행중 / 완료 / 지연'],
    ['진행률', '0~100 사이 숫자'],
    ['날짜형식', 'YYYY-MM-DD (예: 2026-01-15)'],
    ['점수', '0~100 사이 숫자'],
    ['등급기준', 'S: 90이상 / A: 80~89 / B: 70~79 / C: 60~69 / D: 60미만'],
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(guideData);
  ws4['!cols'] = [{ wch: 12 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws4, '입력가이드');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, '쉐어드서비스_평가_업로드템플릿.xlsx');
}

// ─── 업로드 파싱 ───

export interface ParsedExcelData {
  companies: Company[];
  errors: string[];
}

/** 업로드된 엑셀 파일을 파싱하여 Company[] 로 변환 */
export function parseExcelFile(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: 'array' });
      const errors: string[] = [];
      const companiesMap = new Map<string, Company>();

      // 시트1: 영역별점수 파싱
      const scoreSheet = wb.Sheets['영역별점수'];
      if (scoreSheet) {
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(scoreSheet);
        rows.forEach((row, idx) => {
          const name = String(row['회사명'] ?? '').trim();
          if (!name || name === '(회사명 입력)') return;

          const areaScores: AreaScore[] = [];
          for (const area of SHARED_AREAS) {
            const val = Number(row[area]);
            if (isNaN(val) || val < 0 || val > 100) {
              errors.push(`[영역별점수] ${idx + 2}행: ${name}의 ${area} 점수가 유효하지 않습니다.`);
              areaScores.push({ area, score: 0 });
            } else {
              areaScores.push({ area, score: val });
            }
          }

          const previousScore = row['전기점수'] !== undefined && row['전기점수'] !== ''
            ? Number(row['전기점수'])
            : null;

          const overallScore = calculateOverallScore(areaScores);
          const id = `U${String(idx + 1).padStart(3, '0')}`;

          companiesMap.set(name, {
            id,
            name,
            areaScores,
            overallScore,
            grade: getGrade(overallScore),
            previousScore: previousScore !== null && !isNaN(previousScore) ? previousScore : null,
            tasks: [],
            strengths: identifyStrengths(areaScores),
            weaknesses: identifyWeaknesses(areaScores),
            risks: [],
            summary: '',
          });
        });
      } else {
        errors.push('[오류] "영역별점수" 시트를 찾을 수 없습니다.');
      }

      // 시트2: 중점추진과제 파싱
      const taskSheet = wb.Sheets['중점추진과제'];
      if (taskSheet) {
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(taskSheet);
        rows.forEach((row, idx) => {
          const companyName = String(row['회사명'] ?? '').trim();
          if (!companyName || companyName === '(회사명)') return;

          const company = companiesMap.get(companyName);
          if (!company) {
            errors.push(`[중점추진과제] ${idx + 2}행: "${companyName}" 회사가 영역별점수 시트에 없습니다.`);
            return;
          }

          const task: Task = {
            id: `UT${String(idx + 1).padStart(3, '0')}`,
            companyId: company.id,
            companyName,
            taskName: String(row['과제명'] ?? ''),
            category: (String(row['구분'] ?? '개선과제')) as Task['category'],
            area: (String(row['영역'] ?? '회계')) as SharedArea,
            priority: (String(row['우선순위'] ?? '중')) as Task['priority'],
            assignee: String(row['담당자'] ?? ''),
            startDate: formatDate(row['시작일']),
            endDate: formatDate(row['종료예정일']),
            progress: Math.min(100, Math.max(0, Number(row['진행률(%)'] ?? 0))),
            status: (String(row['상태'] ?? '예정')) as Task['status'],
            expectedEffect: String(row['기대효과'] ?? ''),
            risk: String(row['리스크'] ?? ''),
            note: String(row['비고'] ?? ''),
          };

          if (!task.taskName) {
            errors.push(`[중점추진과제] ${idx + 2}행: 과제명이 비어있습니다.`);
            return;
          }

          company.tasks.push(task);
          if (task.risk) {
            company.risks.push(task.risk);
          }
        });
      }

      // 종합의견 자동 생성
      companiesMap.forEach((company) => {
        company.summary = generateAutoSummary(company);
      });

      resolve({
        companies: Array.from(companiesMap.values()),
        errors,
      });
    };
    reader.readAsArrayBuffer(file);
  });
}

/** 엑셀 날짜 → 문자열 변환 */
function formatDate(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'number') {
    // 엑셀 시리얼 날짜
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  return String(value);
}

/** 점수 기반 강점 영역 자동 식별 (상위 3개) */
function identifyStrengths(scores: AreaScore[]): string[] {
  return [...scores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((s) => s.score >= 80)
    .map((s) => s.area);
}

/** 점수 기반 보완 영역 자동 식별 (하위 중 70점 미만) */
function identifyWeaknesses(scores: AreaScore[]): string[] {
  return [...scores]
    .sort((a, b) => a.score - b.score)
    .filter((s) => s.score < 70)
    .map((s) => s.area);
}

/** 자동 종합의견 생성 */
function generateAutoSummary(company: Company): string {
  const { grade, strengths, weaknesses, tasks } = company;
  const delayed = tasks.filter((t) => t.status === '지연').length;

  let summary = '';
  if (grade === 'S' || grade === 'A') {
    summary = '전반적인 운영수준이 양호함.';
  } else if (grade === 'B') {
    summary = '보통 수준의 운영 상태로 개선 여지가 있음.';
  } else {
    summary = '전반적인 운영수준이 미흡하여 집중적인 개선이 필요함.';
  }

  if (strengths.length > 0) {
    summary += ` ${strengths.join(', ')} 영역이 우수함.`;
  }
  if (weaknesses.length > 0) {
    summary += ` ${weaknesses.join(', ')} 영역의 보완이 시급함.`;
  }
  if (delayed > 0) {
    summary += ` 지연 과제 ${delayed}건에 대한 조속한 조치 필요.`;
  }

  return summary;
}
