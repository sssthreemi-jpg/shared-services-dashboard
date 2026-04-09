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
  Legend,
  Tooltip,
} from 'recharts';

interface Props {
  company: Company;
  allCompanies: Company[];
}

export function CompanyRadarChart({ company, allCompanies }: Props) {
  const averages = getAreaAverages(allCompanies);

  const data = SHARED_AREAS.map((area) => ({
    area: area.length > 4 ? area.slice(0, 4) + '..' : area,
    fullArea: area,
    company: company.areaScores.find((a) => a.area === area)?.score ?? 0,
    average: averages.get(area) ?? 0,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          영역별 점수 비교 (vs 전체 평균)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid />
            <PolarAngleAxis dataKey="area" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value, name) => [
                `${value}점`,
                name === 'company' ? company.name : '전체 평균',
              ]}
            />
            <Radar
              name={company.name}
              dataKey="company"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="전체 평균"
              dataKey="average"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
