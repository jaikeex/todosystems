import { memo, useState, useCallback } from 'react';
import TaskItemEditor from './TaskItemEditor';
import TaskItemDisplay from './TaskItemDisplay';
import type { Task } from '@/tasks/types';
import {
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation,
  useUpdateTextMutation
} from '@/tasks/store/api/tasks';
import { MAX_TASK_TEXT_LENGTH } from '@/constants';
import { useAppDispatch } from '@/store/hooks';
import { setError } from '@/store/error/errorSlice';

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const dispatch = useAppDispatch();

  const [complete, { isLoading: isCompleting }] = useCompleteMutation({
    fixedCacheKey: `complete-${task.id}`
  });

  const [incomplete, { isLoading: isIncompleting }] = useIncompleteMutation({
    fixedCacheKey: `incomplete-${task.id}`
  });

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation({
    fixedCacheKey: `delete-${task.id}`
  });

  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation({
    fixedCacheKey: `update-${task.id}`
  });

  const isLoading = isCompleting || isIncompleting || isDeleting || isUpdating;

  const toggleTaskStatus = useCallback(() => {
    if (task.completed) {
      incomplete(task.id);
    } else {
      complete(task.id);
    }
  }, [task.completed, task.id, incomplete, complete]);

  const handleSave = useCallback(async () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setText(task.text);
      setEditing(false);
      return;
    }

    // Should never happen as the input is limited, but just in case
    if (trimmedText.length > MAX_TASK_TEXT_LENGTH) {
      setText(task.text);
      setEditing(false);

      dispatch(
        setError(`Task name cannot exceed ${MAX_TASK_TEXT_LENGTH} characters`)
      );
      return;
    }

    if (trimmedText === task.text) {
      setEditing(false);
      return;
    }

    try {
      await updateText({ id: task.id, text: trimmedText }).unwrap();
    } catch {
      setText(task.text);
    }

    setEditing(false);
  }, [text, task.id, task.text, updateText, dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') setEditing(false);
    },
    [handleSave]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

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

  if (editing) {
    return (
      <TaskItemEditor
        text={text}
        onChange={handleInputChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
      />
    );
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
