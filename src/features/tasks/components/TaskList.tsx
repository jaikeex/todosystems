import type { Task } from '@/tasks/types';
import TaskItem from './TaskItem';
import SkeletonList from './SkeletonList';
import { Typography } from '@/ui';
import { selectFilter, useVisibleTasks } from '@/tasks/hooks';
import { useGetAllQuery } from '@/tasks/store/api/tasks';
import { useAppSelector } from '@/store/hooks';

const TaskList = () => {
  const tasks = useVisibleTasks();
  const filter = useAppSelector(selectFilter);
  const { isLoading, isError } = useGetAllQuery();

  if (isLoading && tasks.length === 0) {
    return <SkeletonList />;
  }

  if (isError) {
    return null;
  }

  if (!tasks.length) {
    const emptyMessage =
      filter === 'done'
        ? 'No completed tasks'
        : filter === 'active'
        ? 'No active tasks'
        : 'No tasks yet. Add one above!';

    return (
      <Typography as="p" variant="body" className="text-center">
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <ul className="w-full space-y-2">
        {tasks.map((t: Task) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
