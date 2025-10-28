import { memo, useState, useCallback } from 'react';
import TaskItemEditor from './TaskItemEditor';
import TaskItemDisplay from './TaskItemDisplay';
import type { Task } from '@/types';
import {
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation,
  useUpdateTextMutation
} from '@/tasks/model/api/tasks';

interface Props {
  task: Task;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);

  const [complete, { isLoading: isCompleting }] = useCompleteMutation();
  const [incomplete, { isLoading: isIncompleting }] = useIncompleteMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation();

  const isLoading = isCompleting || isIncompleting || isDeleting || isUpdating;

  const toggleTaskStatus = useCallback(() => {
    if (task.completed) {
      incomplete(task.id);
    } else {
      complete(task.id);
    }
  }, [task.completed, task.id, incomplete, complete]);

  const handleSave = useCallback(() => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setText(task.text);
      setEditing(false);
      return;
    }

    if (trimmedText !== task.text) {
      updateText({ id: task.id, text: trimmedText });
    }

    setEditing(false);
  }, [text, task.id, task.text, updateText]);

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
