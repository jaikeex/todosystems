import { useMemo } from 'react';
import { Tooltip, Checkbox, Typography } from '@/ui';
import {
  useTaskBulkActions,
  useTaskCounts,
  useVisibleTasks
} from '@/features/tasks/hooks';
import { twMerge } from 'tailwind-merge';

export default function TaskListHeader() {
  const { done, all } = useTaskCounts();
  const visibleTasks = useVisibleTasks();
  const { busy, toggleAll, deleteAll } = useTaskBulkActions();

  const allCompleted = useMemo(() => {
    return visibleTasks.length > 0 && visibleTasks.every((t) => t.completed);
  }, [visibleTasks]);

  return (
    <div className="flex items-center justify-between gap-3 py-2 pb-1">
      <div className="flex items-center gap-2 ml-2">
        <Tooltip position="right" content="Toggle all visible tasks">
          <Checkbox
            checked={allCompleted}
            onChange={toggleAll}
            disabled={!all || busy.completing || visibleTasks.length === 0}
            aria-label={`Toggle all filtered tasks ${
              allCompleted ? 'incomplete' : 'complete'
            }`}
          />
        </Tooltip>

        <Typography as="span" variant="label">
          Done: {done}/{all}
        </Typography>
      </div>

      <button
        onClick={deleteAll}
        disabled={!done || busy.deleting}
        className={twMerge(
          'disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1 bg-transparent transition-colors duration-200 cursor-pointer',
          'border border-danger-500 rounded-md',
          !done || busy.deleting
            ? 'opacity-40 cursor-not-allowed'
            : 'opacity-100 cursor-pointer hover:text-danger-500 '
        )}
        aria-label={`Delete all ${done} completed task${done !== 1 ? 's' : ''}`}
      >
        <Typography variant="label">Delete all completed tasks</Typography>
      </button>
    </div>
  );
}
