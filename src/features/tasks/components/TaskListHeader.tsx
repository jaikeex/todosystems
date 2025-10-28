import Tooltip from '@/ui/Tooltip';
import Checkbox from '@/ui/Checkbox';
import { useTaskBulkActions, useTaskCounts } from '../hooks';
import { useMemo } from 'react';
import { Typography } from '@/ui';
import cn from 'classnames';

export default function TaskListHeader() {
  const { done, all } = useTaskCounts();
  const { busy, toggleAll, deleteAll } = useTaskBulkActions();

  const allCompleted = useMemo(() => {
    return all > 0 && done === all;
  }, [done, all]);

  return (
    <div className="flex items-center justify-between gap-3 py-2 pb-1">
      <div className="flex items-center gap-2 ml-2">
        <Tooltip position="right" content="Toggle all tasks">
          <Checkbox
            checked={allCompleted}
            onChange={toggleAll}
            disabled={!all || busy.completing}
            aria-label={`Toggle all tasks ${
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
        className={cn(
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
