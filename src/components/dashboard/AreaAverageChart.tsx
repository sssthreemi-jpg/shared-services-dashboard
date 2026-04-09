'use client';

import { Company } from '@/types';
import { getAreaAverages } from '@/utils/evaluation';
import { SHARED_AREAS } from '@/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface Props {
  companies: Company[];
}

export function AreaAverageChart({ companies }: Props) {
  const averages = getAreaAverages(companies);
  const data = SHARED_AREAS.map((area) => ({
    area: area.length > 4 ? area.slice(0, 4) + '..' : area,
    fullArea: area,
    average: averages.get(area) ?? 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">영역별 평균 점수</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid />
            <PolarAngleAxis dataKey="area" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value, _name, props) => [
                `${value}점`,
                (props as { payload: { fullArea: string } }).payload.fullArea,
              ]}
            />
            <Radar
              name="평균"
              dataKey="average"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
