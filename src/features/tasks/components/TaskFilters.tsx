import { useMemo } from 'react';
import { FilterBadge, Typography } from '@/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FILTERS } from '@/constants';
import { setFilter } from '@/features/tasks/store';
import type { Filter } from '@/tasks/types';
import { useTaskCounts } from '@/tasks/hooks';

const TaskFilters = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.tasksFilter.filter);
  const counts = useTaskCounts();

  const handlers = useMemo(() => {
    return FILTERS.reduce<Record<Filter, () => void>>((acc, f) => {
      acc[f] = () => dispatch(setFilter(f));
      return acc;
    }, {} as Record<Filter, () => void>);
  }, [dispatch]);

  const getCountForFilter = (f: Filter): number => counts[f];

  return (
    <div className="flex items-center justify-between gap-2 ml-2">
      <Typography variant="label">Show:</Typography>
      <div className="flex gap-2 items-center flex-wrap">
        {FILTERS.map((f) => (
          <FilterBadge
            key={f}
            label={f}
            count={getCountForFilter(f)}
            active={f === filter}
            onClick={handlers[f]}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskFilters;
