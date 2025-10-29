import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useGetAllQuery } from '@/tasks/store/api/tasks';
import type { Task } from '@/tasks/types';

export function useVisibleTasks() {
  const { data: tasks = [] } = useGetAllQuery();
  const filter = useAppSelector((state) => state.tasksFilter.filter);

  return useMemo(() => {
    switch (filter) {
      case 'done':
        return tasks.filter((t: Task) => t.completed);
      case 'active':
        return tasks.filter((t: Task) => !t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);
}
