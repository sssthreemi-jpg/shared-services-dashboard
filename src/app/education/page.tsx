'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Target,
  Users,
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
} from 'lucide-react';

/* ── 4월 교육 아젠다 데이터 ── */
const aprilAgenda = [
  {
    week: '2주차',
    owner: '회계',
    topic: '회계실무 기초교육 (전표입력 → 비용지급)',
    status: 'completed',
  },
  {
    week: '3주차',
    owner: '회계',
    topic: '회계실무 기초교육 (월마감 체크리스트 + Cut-off + 세금계산서 실무 통합)',
    status: 'current',
  },
  {
    week: '4-1주차',
    owner: '기획',
    topic: '전결규정 + 예산관리 교육',
    status: 'upcoming',
  },
  {
    week: '4-2주차',
    owner: '재무',
    topic: '법인카드 발급/사용/정산 프로세스 실무 교육',
    status: 'upcoming',
  },
  {
    week: '5주차',
    owner: '재무',
    topic: '자금 집행 프로세스 교육 및 오류 식별/통제 포인트 점검',
    status: 'upcoming',
  },
];

const ownerColorMap: Record<string, string> = {
  회계: 'bg-blue-100 text-blue-700 border-blue-200',
  기획: 'bg-amber-100 text-amber-700 border-amber-200',
  재무: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  completed: { label: '완료', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  current: { label: '진행중', color: 'bg-blue-100 text-blue-700', icon: Clock },
  upcoming: { label: '예정', color: 'bg-slate-100 text-slate-600', icon: Calendar },
};

const purposes = [
  '전 그룹사에 대웅제약 수준의 표준화된 업무기준, 프로세스 공유',
  '내/외부 성공사례 및 벤치마킹 기반 교육을 통해 관리직원의 실무 전문성과 문제 해결 역량 강화',
  '회사별 이슈사항 및 애로사항을 오픈하고 공동 해결함으로써 경영 리스크 사전 차단',
];

export default function EducationPage() {
  const completedCount = aprilAgenda.filter((a) => a.status === 'completed').length;
  const currentCount = aprilAgenda.filter((a) => a.status === 'current').length;
  const upcomingCount = aprilAgenda.filter((a) => a.status === 'upcoming').length;

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          2026년 재무회계 쉐어드 학습과 소통 운영(안)
        </h2>
        <p className="text-sm text-muted-foreground">
          4월 교육 아젠다 및 운영 현황
        </p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
              <p className="text-xs text-muted-foreground">완료 교육</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{currentCount}</p>
              <p className="text-xs text-muted-foreground">진행중 교육</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <Calendar className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{upcomingCount}</p>
              <p className="text-xs text-muted-foreground">예정 교육</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 목적과 취지 + 참석 대상자 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              목적과 취지
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {purposes.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              참석 대상자
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                대웅그룹 회계/기획 담당 실무자 및 직책자
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                주관 부서별 교육 건수
              </p>
              <div className="flex gap-3">
                {Object.entries(
                  aprilAgenda.reduce<Record<string, number>>((acc, cur) => {
                    acc[cur.owner] = (acc[cur.owner] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([owner, count]) => (
                  <div
                    key={owner}
                    className="flex flex-col items-center rounded-lg border px-4 py-2"
                  >
                    <Badge variant="outline" className={ownerColorMap[owner]}>
                      {owner}
                    </Badge>
                    <span className="mt-1 text-lg font-bold text-slate-900">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4월 교육 아젠다 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            4월 교육 아젠다
          </CardTitle>
          <CardDescription>주차별 교육 일정 및 진행 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">월</TableHead>
                <TableHead className="w-[80px]">날짜</TableHead>
                <TableHead className="w-[80px]">주관</TableHead>
                <TableHead>주제</TableHead>
                <TableHead className="w-[90px]">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aprilAgenda.map((item, idx) => {
                const status = statusConfig[item.status];
                const StatusIcon = status.icon;
                return (
                  <TableRow
                    key={idx}
                    className={
                      item.status === 'current' ? 'bg-blue-50/60' : ''
                    }
                  >
                    <TableCell className="font-semibold text-slate-900">
                      {idx === 0 ? '4월' : ''}
                    </TableCell>
                    <TableCell className="font-medium">{item.week}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={ownerColorMap[item.owner]}
                      >
                        {item.owner}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[400px] whitespace-normal text-slate-700">
                      {item.topic}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 교육 진행률 프로그레스 */}
      <Card>
        <CardHeader>
          <CardTitle>4월 교육 진행률</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">전체 진행률</span>
              <span className="font-semibold text-slate-900">
                {Math.round(((completedCount + currentCount * 0.5) / aprilAgenda.length) * 100)}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                style={{
                  width: `${((completedCount + currentCount * 0.5) / aprilAgenda.length) * 100}%`,
                }}
              />
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                완료 {completedCount}건
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                진행중 {currentCount}건
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                예정 {upcomingCount}건
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
