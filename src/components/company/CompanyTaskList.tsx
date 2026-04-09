'use client';

import { Task } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';
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
  tasks: Task[];
  title?: string;
}

export function CompanyTaskList({ tasks, title = '중점추진과제' }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          {title} ({tasks.length}건)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>과제명</TableHead>
                <TableHead className="text-center">구분</TableHead>
                <TableHead className="text-center">영역</TableHead>
                <TableHead className="text-center">우선순위</TableHead>
                <TableHead className="text-center">담당자</TableHead>
                <TableHead className="text-center">종료예정</TableHead>
                <TableHead className="text-center w-28">진행률</TableHead>
                <TableHead className="text-center">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className={cn(task.status === '지연' && 'bg-red-50/50')}
                >
                  <TableCell className="font-medium max-w-[200px]">
                    <div>{task.taskName}</div>
                    {task.risk && (
                      <div className="text-xs text-red-500 mt-0.5">
                        리스크: {task.risk}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-xs">{task.category}</TableCell>
                  <TableCell className="text-center text-xs">{task.area}</TableCell>
                  <TableCell className="text-center">
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="text-center text-sm">{task.assignee}</TableCell>
                  <TableCell className="text-center text-sm">{task.endDate}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-8">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={task.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
