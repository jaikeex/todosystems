import { useMemo } from 'react';
import { useGetAllQuery } from '@/tasks/store/api/tasks';

export function useTaskCounts() {
  const counts = useGetAllQuery(undefined, {
    selectFromResult: ({ data = [] }) => ({
      done: data.filter((t) => t.completed).length,
      active: data.filter((t) => !t.completed).length,
      all: data.length
    })
  });

  return useMemo(() => {
    return counts;
  }, [counts]);
}
