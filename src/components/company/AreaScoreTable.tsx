'use client';

import { AreaScore } from '@/types';
import { AREA_WEIGHTS, IMPROVEMENT_THRESHOLDS } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Props {
  areaScores: AreaScore[];
}

export function AreaScoreTable({ areaScores }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">영역별 평가 점수</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>영역</TableHead>
              <TableHead className="text-center w-20">가중치</TableHead>
              <TableHead className="text-center w-20">점수</TableHead>
              <TableHead className="w-40">수준</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areaScores.map((as) => {
              const weight = AREA_WEIGHTS.find((w) => w.area === as.area);
              const isLow = as.score < IMPROVEMENT_THRESHOLDS.areaScoreMin;
              return (
                <TableRow key={as.area}>
                  <TableCell className="font-medium">{as.area}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {weight ? `${(weight.weight * 100).toFixed(0)}%` : '-'}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-center font-bold',
                      isLow ? 'text-red-600' : as.score >= 85 ? 'text-blue-600' : ''
                    )}
                  >
                    {as.score}
                  </TableCell>
                  <TableCell>
                    <Progress
                      value={as.score}
                      className={cn(
                        'h-2',
                        isLow && '[&>div]:bg-red-500'
                      )}
                    />
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
