import { useCallback } from 'react';
import FilterBadge from '@/ui/FilterBadge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilter, type Filter } from '@/store/tasks/taskFilterSlice';
import { selectFilter, useTaskCounts } from '../hooks';

const FILTERS: Filter[] = ['all', 'active', 'done'];

const TaskFilters = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
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
  );
};

export default TaskFilters;
