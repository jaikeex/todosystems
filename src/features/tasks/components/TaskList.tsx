import { selectFilter, useVisibleTasks } from '../hooks';
import TaskItem from './TaskItem';
import { useGetAllQuery } from '@/store/api/tasks';
import type { Task } from '../../../types/task';
import { useAppSelector } from '@/store/hooks';
import { SkeletonList } from '.';
import { Typography } from '@/ui/Typography';

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
