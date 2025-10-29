import { useMemo } from 'react';
import { Tooltip, Checkbox, Typography, Button } from '@/ui';
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

      <Button
        onClick={deleteAll}
        disabled={!done || busy.deleting}
        size="small"
        color="ghost"
        className={twMerge(
          'border border-danger-500',
          !done || busy.deleting
            ? 'opacity-40 disabled:bg-transparent'
            : ' hover:text-danger-500 '
        )}
        aria-label={`Delete all ${done} completed task${done !== 1 ? 's' : ''}`}
      >
        <Typography variant="label">Delete all completed tasks</Typography>
      </Button>
    </div>
  );
}
