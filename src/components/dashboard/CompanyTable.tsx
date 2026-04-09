'use client';

import { Company } from '@/types';
import { getScoreDelta } from '@/utils/evaluation';
import { GradeBadge } from '@/components/shared/GradeBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  companies: Company[];
}

export function CompanyTable({ companies }: Props) {
  const sorted = [...companies].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">회사별 종합 평가 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">순위</TableHead>
              <TableHead>회사명</TableHead>
              <TableHead className="text-center">종합점수</TableHead>
              <TableHead className="text-center">등급</TableHead>
              <TableHead className="text-center">전기대비</TableHead>
              <TableHead className="text-center">과제</TableHead>
              <TableHead className="text-center">지연</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((c, idx) => {
              const delta = getScoreDelta(c.overallScore, c.previousScore);
              const delayed = c.tasks.filter((t) => t.status === '지연').length;
              return (
                <TableRow key={c.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-semibold">{c.name}</TableCell>
                  <TableCell className="text-center font-bold">
                    {c.overallScore}
                  </TableCell>
                  <TableCell className="text-center">
                    <GradeBadge grade={c.grade} size="sm" />
                  </TableCell>
                  <TableCell className="text-center">
                    {delta !== null ? (
                      <span
                        className={cn(
                          'text-sm font-medium',
                          delta > 0 && 'text-green-600',
                          delta < 0 && 'text-red-600',
                          delta === 0 && 'text-slate-500'
                        )}
                      >
                        {delta > 0 ? '+' : ''}
                        {delta}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{c.tasks.length}건</TableCell>
                  <TableCell className="text-center">
                    {delayed > 0 ? (
                      <span className="text-sm font-medium text-red-600">
                        {delayed}건
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/company/${c.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
