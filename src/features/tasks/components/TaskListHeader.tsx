import Tooltip from '@/ui/Tooltip';
import Checkbox from '@/ui/Checkbox';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useTaskBulkActions, useTaskCounts } from '../hooks';
import { useMemo } from 'react';

export default function TaskListHeader() {
  const { done, all } = useTaskCounts();
  const { busy, toggleAll, deleteAll } = useTaskBulkActions();

  const allCompleted = useMemo(() => {
    return all > 0 && done === all;
  }, [done, all]);

  return (
    <div className="flex items-center justify-between gap-3 p-2 pb-1">
      <div className="flex items-center gap-2">
        <Tooltip content="Toggle all tasks">
          <Checkbox
            checked={allCompleted}
            onChange={toggleAll}
            disabled={!all || busy.completing}
            aria-label="Toggle all tasks"
            role="checkbox"
          />
        </Tooltip>

        <span className="text-sm">
          Done: {done}/{all}
        </span>
      </div>

      <Tooltip content="Delete all completed tasks">
        <button
          onClick={deleteAll}
          disabled={!done || busy.deleting}
          aria-label="Delete all completed tasks"
          role="button"
          className="text-md text-red-700 hover:text-red-600 cursor-pointer transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </Tooltip>
    </div>
  );
}
