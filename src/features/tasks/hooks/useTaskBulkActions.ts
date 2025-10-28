import { useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { tasksSelectors } from '@/tasks/store';
import {
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation
} from '@/tasks/store/api/tasks';
import { useTaskCounts } from './useTaskCounts';

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

    await Promise.allSettled(mutations);
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
