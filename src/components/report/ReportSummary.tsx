'use client';

import { Company } from '@/types';
import { generateReportRows } from '@/utils/evaluation';
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
import { FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  companies: Company[];
}

export function ReportSummary({ companies }: Props) {
  const rows = generateReportRows(companies);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          경영진 보고용 요약
        </h2>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
          <Printer className="h-4 w-4" />
          인쇄
        </Button>
      </div>

      {/* 보고서 헤더 (인쇄시 표시) */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-xl font-bold">쉐어드서비스 운영평가 종합보고</h1>
        <p className="text-sm text-muted-foreground mt-1">
          보고일: {new Date().toLocaleDateString('ko-KR')}
        </p>
      </div>

      <Card className="print:shadow-none print:border-0">
        <CardHeader className="pb-2 print:pb-1">
          <CardTitle className="text-base font-semibold">회사별 종합평가 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">회사명</TableHead>
                  <TableHead className="text-center w-16">점수</TableHead>
                  <TableHead className="text-center w-12">등급</TableHead>
                  <TableHead>강점영역</TableHead>
                  <TableHead>보완영역</TableHead>
                  <TableHead>중점추진과제</TableHead>
                  <TableHead>주요 리스크</TableHead>
                  <TableHead className="min-w-[200px]">종합의견</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.companyName}>
                    <TableCell className="font-semibold">{row.companyName}</TableCell>
                    <TableCell className="text-center font-bold">{row.overallScore}</TableCell>
                    <TableCell className="text-center">
                      <GradeBadge grade={row.grade} size="sm" />
                    </TableCell>
                    <TableCell className="text-xs text-green-700">
                      {row.strengths || '-'}
                    </TableCell>
                    <TableCell className="text-xs text-red-700">
                      {row.weaknesses || '-'}
                    </TableCell>
                    <TableCell className="text-xs">{row.keyTasks || '-'}</TableCell>
                    <TableCell className="text-xs text-red-600">{row.risks || '-'}</TableCell>
                    <TableCell className="text-xs leading-relaxed">{row.opinion}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
