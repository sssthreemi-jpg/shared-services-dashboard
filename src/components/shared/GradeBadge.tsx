'use client';

import { Badge } from '@/components/ui/badge';
import { Grade } from '@/types';
import { cn } from '@/lib/utils';

const gradeStyles: Record<Grade, string> = {
  S: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  A: 'bg-blue-100 text-blue-800 border-blue-300',
  B: 'bg-green-100 text-green-800 border-green-300',
  C: 'bg-amber-100 text-amber-800 border-amber-300',
  D: 'bg-red-100 text-red-800 border-red-300',
};

interface GradeBadgeProps {
  grade: Grade;
  size?: 'sm' | 'md' | 'lg';
}

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        gradeStyles[grade],
        'font-bold',
        size === 'sm' && 'text-xs px-1.5 py-0',
        size === 'md' && 'text-sm px-2 py-0.5',
        size === 'lg' && 'text-lg px-3 py-1'
      )}
    >
      {grade}
    </Badge>
  );
}
