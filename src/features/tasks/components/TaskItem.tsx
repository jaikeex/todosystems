import { memo, useState, useCallback } from 'react';
import TaskItemEditor from './TaskItemEditor';
import TaskItemDisplay from './TaskItemDisplay';
import type { Task } from '@/features/tasks/types';
import {
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation
} from '@/features/tasks/store/api/tasks';

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const [editing, setEditing] = useState(false);

  const [complete, { isLoading: isCompleting }] = useCompleteMutation();
  const [incomplete, { isLoading: isIncompleting }] = useIncompleteMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const isLoading = isCompleting || isIncompleting || isDeleting;

  const toggleTaskStatus = useCallback(() => {
    if (task.completed) {
      incomplete(task.id);
    } else {
      complete(task.id);
    }
  }, [task.completed, task.id, incomplete, complete]);

  const handleEditClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isLoading) handleEditClick();
      }
    },
    [isLoading, handleEditClick]
  );

  const handleDeleteClick = useCallback(() => {
    deleteTask(task.id);
  }, [task.id, deleteTask]);

  const handleEditComplete = useCallback(() => {
    setEditing(false);
  }, []);

  if (editing) {
    return <TaskItemEditor task={task} onComplete={handleEditComplete} />;
  }

  return (
    <TaskItemDisplay
      task={task}
      isLoading={isLoading}
      onToggleStatus={toggleTaskStatus}
      onEditClick={handleEditClick}
      onEditKeyDown={handleEditKeyDown}
      onDeleteClick={handleDeleteClick}
    />
  );
};

export default memo(TaskItem);
