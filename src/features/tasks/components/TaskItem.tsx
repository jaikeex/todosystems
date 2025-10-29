import { memo, useState, useCallback, useEffect } from 'react';
import TaskItemEditor from './TaskItemEditor';
import TaskItemDisplay from './TaskItemDisplay';
import type { Task } from '@/features/tasks/types';
import {
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation
} from '@/features/tasks/store/api/tasks';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFlashTask, selectShouldFlash } from '@/features/tasks/store';

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);

  const shouldFlash = useAppSelector((state) =>
    selectShouldFlash(state, task.id)
  );

  const [complete, { isLoading: isCompleting }] = useCompleteMutation();
  const [incomplete, { isLoading: isIncompleting }] = useIncompleteMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const isLoading = isCompleting || isIncompleting || isDeleting;

  useEffect(() => {
    if (shouldFlash) {
      const timer = setTimeout(() => {
        dispatch(removeFlashTask(task.id));
      }, 1000); // should match the actual animation duration

      return () => clearTimeout(timer);
    }
  }, [shouldFlash, task.id, dispatch]);

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
      flash={shouldFlash}
      onToggleStatus={toggleTaskStatus}
      onEditClick={handleEditClick}
      onEditKeyDown={handleEditKeyDown}
      onDeleteClick={handleDeleteClick}
    />
  );
};

export default memo(TaskItem);
