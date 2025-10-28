import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { tasksSelectors } from '@/tasks/store';

export function useTaskCounts() {
  const tasks = useAppSelector(tasksSelectors.selectAll);

  return useMemo(() => {
    const done = tasks.reduce(
      (count, task) => count + (task.completed ? 1 : 0),
      0
    );
    const all = tasks.length;
    const active = all - done;

    return { all, active, done };
  }, [tasks]);
}
