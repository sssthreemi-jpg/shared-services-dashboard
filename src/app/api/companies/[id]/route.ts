import { NextResponse } from 'next/server';
import { companies } from '@/data/mockData';

/**
 * GET /api/companies/:id
 * 특정 회사 상세 조회
 *
 * 향후: const company = await prisma.company.findUnique({ where: { id } })
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return NextResponse.json(
      { error: '회사를 찾을 수 없습니다.' },
      { status: 404 }
    );
  }

  return NextResponse.json(company);
}
