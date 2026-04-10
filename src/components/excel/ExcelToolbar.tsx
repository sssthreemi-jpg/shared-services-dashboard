'use client';

import { useRef, useState } from 'react';
import { Company } from '@/types';
import { downloadEvaluationExcel, downloadTemplate, parseExcelFile, ParsedExcelData } from '@/utils/excel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  companies: Company[];
  onDataUploaded: (companies: Company[]) => void;
}

export function ExcelToolbar({ companies, onDataUploaded }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<ParsedExcelData | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await parseExcelFile(file);
      setUploadResult(result);

      if (result.companies.length > 0) {
        onDataUploaded(result.companies);
      }
    } catch {
      setUploadResult({
        companies: [],
        errors: ['파일을 읽을 수 없습니다. 올바른 엑셀 파일인지 확인해주세요.'],
      });
    } finally {
      setUploading(false);
      // 같은 파일 재업로드 가능하도록 초기화
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          엑셀 업로드 / 다운로드
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {/* 다운로드 버튼들 */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => downloadEvaluationExcel(companies)}
          >
            <Download className="h-4 w-4" />
            평가 데이터 다운로드
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={downloadTemplate}
          >
            <Download className="h-4 w-4" />
            업로드 템플릿 다운로드
          </Button>

          {/* 업로드 버튼 */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
              {uploading ? '처리 중...' : '엑셀 업로드'}
            </Button>
          </div>
        </div>

        {/* 업로드 결과 표시 */}
        {uploadResult && (
          <div className="mt-4 space-y-2">
            {uploadResult.companies.length > 0 && (
              <div className="flex items-start gap-2 rounded-md bg-green-50 border border-green-200 p-3">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    업로드 성공: {uploadResult.companies.length}개 회사 데이터 반영
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    {uploadResult.companies.map((c) => `${c.name}(${c.overallScore}점/${c.grade}등급)`).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {uploadResult.errors.length > 0 && (
              <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    경고 ({uploadResult.errors.length}건)
                  </p>
                  <ul className="text-xs text-amber-700 mt-1 space-y-0.5">
                    {uploadResult.errors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              className="text-xs text-muted-foreground hover:underline"
              onClick={() => setUploadResult(null)}
            >
              닫기
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
