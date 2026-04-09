'use client';

import { Badge } from '@/components/ui/badge';
import { TaskStatus, Priority } from '@/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<TaskStatus, string> = {
  '예정': 'bg-slate-100 text-slate-700 border-slate-300',
  '진행중': 'bg-blue-100 text-blue-700 border-blue-300',
  '완료': 'bg-green-100 text-green-700 border-green-300',
  '지연': 'bg-red-100 text-red-700 border-red-300',
};

const priorityStyles: Record<Priority, string> = {
  '상': 'bg-red-100 text-red-700 border-red-300',
  '중': 'bg-amber-100 text-amber-700 border-amber-300',
  '하': 'bg-green-100 text-green-700 border-green-300',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], 'text-xs')}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={cn(priorityStyles[priority], 'text-xs')}>
      {priority}
    </Badge>
  );
}
