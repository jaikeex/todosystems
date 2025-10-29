import { useGetAllQuery } from '@/features/tasks/store/api/tasks';

export function useTaskCounts() {
  const counts = useGetAllQuery(undefined, {
    selectFromResult: ({ data = [] }) => {
      const done = data.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
      return {
        done,
        active: data.length - done,
        all: data.length
      };
    }
  });

  return counts;
}
