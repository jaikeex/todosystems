import { useMemo, useCallback } from 'react';
import { useAppSelector } from '../../store/hooks';
import { type RootState } from '../../store/index';
import { tasksSelectors } from '../../store/tasks/tasksEntitiesSlice';
import type { Task } from '../../types/task';
import {
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation
} from '@/store/api/tasks';

export const selectFilter = (state: RootState) => state.taskFilter.filter;

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

export function useTaskBulkActions() {
  const tasks = useAppSelector(tasksSelectors.selectAll);
  const [complete, completeState] = useCompleteMutation();
  const [incomplete, incompleteState] = useIncompleteMutation();
  const [deleteTask, deleteState] = useDeleteTaskMutation();

  const counts = useTaskCounts();

  const allCompleted = counts.all > 0 && counts.done === counts.all;

  const toggleAll = useCallback(async () => {
    const mutations = allCompleted
      ? tasks.filter((t) => t.completed).map((t) => incomplete(t.id))
      : tasks.filter((t) => !t.completed).map((t) => complete(t.id));

    await Promise.all(mutations);
  }, [allCompleted, tasks, complete, incomplete]);

  const deleteAll = useCallback(() => {
    const doneTasks = tasks.filter((t) => t.completed);

    if (!doneTasks.length) {
      return;
    }

    if (
      window.confirm(
        `Delete ${doneTasks.length} completed task${
          doneTasks.length > 1 ? 's' : ''
        }?`
      )
    ) {
      doneTasks.forEach((t) => deleteTask(t.id));
    }
  }, [tasks, deleteTask]);

  return {
    counts,
    allCompleted,
    toggleAll,
    deleteAll,
    busy: {
      completing: completeState.isLoading || incompleteState.isLoading,
      deleting: deleteState.isLoading
    }
  };
}
