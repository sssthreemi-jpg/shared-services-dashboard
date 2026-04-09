import { NextResponse } from 'next/server';
import { companies } from '@/data/mockData';

/**
 * GET /api/companies
 * 전체 회사 목록 조회
 *
 * 현재: mockData에서 직접 반환
 * 향후: DB 쿼리로 교체
 *   예) const companies = await prisma.company.findMany({ include: { areaScores: true, tasks: true } })
 */
export async function GET() {
  // 실제 DB 연결 시 이 부분만 교체하면 됨
  // const companies = await db.company.findMany(...)
  return NextResponse.json(companies);
}
