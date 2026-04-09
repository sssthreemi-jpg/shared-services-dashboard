'use client';

import { Company } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

interface Props {
  company: Company;
}

export function CompanySummary({ company }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4" />
          종합의견 및 리스크
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm leading-relaxed text-slate-700">{company.summary}</p>
        </div>

        {company.risks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-3.5 w-3.5" />
              주요 리스크
            </h4>
            <ul className="space-y-1">
              {company.risks.map((risk, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start gap-2"
                >
                  <span className="text-red-400 mt-1">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {company.strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-700 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              강점 영역
            </h4>
            <p className="text-sm text-slate-600">{company.strengths.join(', ')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
