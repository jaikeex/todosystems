import { useCallback } from 'react';
import {
  useGetAllQuery,
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation
} from '@/features/tasks/store/api/tasks';
import { useTaskCounts } from './useTaskCounts';
import { useVisibleTasks } from './useVisibleTasks';

export function useTaskBulkActions() {
  const { data: tasks = [] } = useGetAllQuery();
  const [complete, completeState] = useCompleteMutation();
  const [incomplete, incompleteState] = useIncompleteMutation();
  const [deleteTask, deleteState] = useDeleteTaskMutation();

  const counts = useTaskCounts();
  const visibleTasks = useVisibleTasks();

  const allCompleted = counts.all > 0 && counts.done === counts.all;

  const toggleAll = useCallback(async () => {
    const allVisibleCompleted =
      visibleTasks.length > 0 && visibleTasks.every((t) => t.completed);

    const mutations = allVisibleCompleted
      ? visibleTasks.filter((t) => t.completed).map((t) => incomplete(t.id))
      : visibleTasks.filter((t) => !t.completed).map((t) => complete(t.id));

    await Promise.allSettled(mutations);
  }, [visibleTasks, complete, incomplete]);

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
