import { useCallback } from 'react';
import { FilterBadge, Typography } from '@/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { FILTERS } from '@/constants';
import { setFilter } from '@/features/tasks/store';
import type { Filter } from '@/features/tasks/store';
import { useTaskCounts } from '@/tasks/hooks';

const TaskFilters = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.tasksFilter.filter);
  const counts = useTaskCounts();

  const handleFilterClick = useCallback(
    (f: Filter) => () => {
      dispatch(setFilter(f));
    },
    [dispatch]
  );

  const getCountForFilter = (f: Filter): number => {
    return counts[f];
  };

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
            onClick={handleFilterClick(f)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskFilters;
