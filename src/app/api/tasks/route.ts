import { NextRequest, NextResponse } from 'next/server';
import { companies } from '@/data/mockData';

/**
 * GET /api/tasks
 * 전체 과제 조회 (필터 지원)
 *
 * Query params:
 *   companyId - 특정 회사 과제만
 *   status    - 상태 필터 (예정/진행중/완료/지연)
 *   priority  - 우선순위 필터 (상/중/하)
 *   area      - 영역 필터
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const companyId = searchParams.get('companyId');
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const area = searchParams.get('area');

  let tasks = companies.flatMap((c) => c.tasks);

  if (companyId) tasks = tasks.filter((t) => t.companyId === companyId);
  if (status) tasks = tasks.filter((t) => t.status === status);
  if (priority) tasks = tasks.filter((t) => t.priority === priority);
  if (area) tasks = tasks.filter((t) => t.area === area);

  return NextResponse.json(tasks);
}
