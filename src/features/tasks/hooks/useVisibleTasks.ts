import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { type RootState } from '@/store/index';
import { useGetAllQuery } from '@/tasks/store/api/tasks';
import type { Task } from '@/tasks/types';

export const selectFilter = (state: RootState) => state.tasksFilter.filter;

export function useVisibleTasks() {
  const { data: tasks = [] } = useGetAllQuery();
  const filter = useAppSelector(selectFilter);

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
