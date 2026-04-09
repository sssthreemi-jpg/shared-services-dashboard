'use client';

import { Loader2 } from 'lucide-react';

export function LoadingState({ message = '데이터를 불러오는 중...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({
  message = '데이터를 불러오지 못했습니다.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p className="text-sm text-red-500 mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-blue-600 hover:underline"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
