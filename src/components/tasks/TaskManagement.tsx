'use client';

import { useState, useMemo } from 'react';
import { Company, TaskStatus, Priority, SharedArea } from '@/types';
import { SHARED_AREAS } from '@/constants';
import { StatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Props {
  companies: Company[];
}

export function TaskManagement({ companies }: Props) {
  const [companyFilter, setCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  const handleCompanyChange = (v: string | null) => setCompanyFilter(v ?? 'all');
  const handleStatusChange = (v: string | null) => setStatusFilter(v ?? 'all');
  const handlePriorityChange = (v: string | null) => setPriorityFilter(v ?? 'all');
  const handleAreaChange = (v: string | null) => setAreaFilter(v ?? 'all');

  const allTasks = useMemo(
    () => companies.flatMap((c) => c.tasks),
    [companies]
  );

  const filtered = useMemo(() => {
    return allTasks.filter((t) => {
      if (companyFilter !== 'all' && t.companyId !== companyFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (areaFilter !== 'all' && t.area !== areaFilter) return false;
      return true;
    });
  }, [allTasks, companyFilter, statusFilter, priorityFilter, areaFilter]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const delayed = filtered.filter((t) => t.status === '지연').length;
    const completed = filtered.filter((t) => t.status === '완료').length;
    const avgProgress =
      total > 0
        ? Math.round(filtered.reduce((s, t) => s + t.progress, 0) / total)
        : 0;
    return { total, delayed, completed, avgProgress };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">회사</label>
              <Select value={companyFilter} onValueChange={handleCompanyChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">상태</label>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {(['예정', '진행중', '완료', '지연'] as TaskStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">우선순위</label>
              <Select value={priorityFilter} onValueChange={handlePriorityChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {(['상', '중', '하'] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">영역</label>
              <Select value={areaFilter} onValueChange={handleAreaChange}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {SHARED_AREAS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 요약 */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white p-3 text-center">
          <p className="text-xs text-muted-foreground">전체</p>
          <p className="text-xl font-bold">{stats.total}건</p>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center">
          <p className="text-xs text-muted-foreground">평균 진행률</p>
          <p className="text-xl font-bold">{stats.avgProgress}%</p>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center">
          <p className="text-xs text-muted-foreground">완료</p>
          <p className="text-xl font-bold text-green-600">{stats.completed}건</p>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center">
          <p className="text-xs text-muted-foreground">지연</p>
          <p className="text-xl font-bold text-red-600">{stats.delayed}건</p>
        </div>
      </div>

      {/* 과제 테이블 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            과제 목록 ({filtered.length}건)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>회사</TableHead>
                  <TableHead>과제명</TableHead>
                  <TableHead className="text-center">구분</TableHead>
                  <TableHead className="text-center">영역</TableHead>
                  <TableHead className="text-center">우선순위</TableHead>
                  <TableHead className="text-center">담당자</TableHead>
                  <TableHead className="text-center">시작일</TableHead>
                  <TableHead className="text-center">종료예정일</TableHead>
                  <TableHead className="text-center w-28">진행률</TableHead>
                  <TableHead className="text-center">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((task) => (
                  <TableRow
                    key={task.id}
                    className={cn(task.status === '지연' && 'bg-red-50/50')}
                  >
                    <TableCell className="text-sm font-medium">{task.companyName}</TableCell>
                    <TableCell className="font-medium max-w-[180px]">
                      <div className="text-sm">{task.taskName}</div>
                      {task.expectedEffect && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          기대효과: {task.expectedEffect}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-xs">{task.category}</TableCell>
                    <TableCell className="text-center text-xs">{task.area}</TableCell>
                    <TableCell className="text-center">
                      <PriorityBadge priority={task.priority} />
                    </TableCell>
                    <TableCell className="text-center text-sm">{task.assignee}</TableCell>
                    <TableCell className="text-center text-xs">{task.startDate}</TableCell>
                    <TableCell className="text-center text-xs">{task.endDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="h-2 flex-1" />
                        <span className="text-xs font-medium w-8">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={task.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      조건에 맞는 과제가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
