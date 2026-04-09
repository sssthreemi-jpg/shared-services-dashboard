'use client';

import { Company } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Props {
  companies: Company[];
}

export function TaskOverview({ companies }: Props) {
  const data = companies.map((c) => {
    const tasks = c.tasks;
    return {
      name: c.name,
      예정: tasks.filter((t) => t.status === '예정').length,
      진행중: tasks.filter((t) => t.status === '진행중').length,
      완료: tasks.filter((t) => t.status === '완료').length,
      지연: tasks.filter((t) => t.status === '지연').length,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">회사별 과제 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="예정" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} />
            <Bar dataKey="진행중" stackId="a" fill="#3b82f6" />
            <Bar dataKey="완료" stackId="a" fill="#22c55e" />
            <Bar dataKey="지연" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
