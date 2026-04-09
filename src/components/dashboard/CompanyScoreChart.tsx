'use client';

import { Company } from '@/types';
import { GRADE_COLORS } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface Props {
  companies: Company[];
  onCompanyClick?: (companyId: string) => void;
}

export function CompanyScoreChart({ companies, onCompanyClick }: Props) {
  const data = [...companies]
    .sort((a, b) => b.overallScore - a.overallScore)
    .map((c) => ({
      id: c.id,
      name: c.name,
      score: c.overallScore,
      grade: c.grade,
      delta:
        c.previousScore !== null
          ? Math.round((c.overallScore - c.previousScore) * 10) / 10
          : null,
    }));

  const avg =
    companies.reduce((s, c) => s + c.overallScore, 0) / companies.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">회사별 종합점수</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, _name, props) => {
                const { grade, delta } = (props as { payload: { grade: string; delta: number | null } }).payload;
                return [
                  `${value}점 (${grade}등급)${delta !== null ? ` / 전기 대비 ${delta > 0 ? '+' : ''}${delta}` : ''}`,
                  '종합점수',
                ];
              }}
            />
            <ReferenceLine
              y={avg}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{ value: `평균 ${avg.toFixed(1)}`, position: 'right', fontSize: 11 }}
            />
            <Bar
              dataKey="score"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
              onClick={(entry) => entry.id && onCompanyClick?.(entry.id as string)}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={GRADE_COLORS[entry.grade]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
