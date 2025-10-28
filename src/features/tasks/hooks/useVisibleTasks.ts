import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { type RootState } from '@/store/index';
import { tasksSelectors } from '@/tasks/model';
import type { Task } from '@/types/task';

export const selectFilter = (state: RootState) => state.tasksFilter.filter;

export function useVisibleTasks() {
  const tasks = useAppSelector(tasksSelectors.selectAll);
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
