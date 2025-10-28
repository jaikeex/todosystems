import { memo, useState, useCallback } from 'react';
import Checkbox from '@/ui/Checkbox';
import Input from '@/ui/Input';
import type { Task } from '@/types';
import {
  useCompleteMutation,
  useIncompleteMutation,
  useDeleteTaskMutation,
  useUpdateTextMutation
} from '@/store/api/tasks';
import cn from 'classnames';
import { FiDelete } from 'react-icons/fi';
import { Typography } from '@/ui/Typography';
import { MAX_TASK_TEXT_LENGTH } from '@/constants';
import Tooltip from '@/ui/Tooltip';

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
      <li className="flex items-center gap-3 p-2 rounded-md min-h-16 bg-surface-600">
        <Input
          value={text}
          onChange={handleInputChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1"
          aria-label="Edit task name"
          maxLength={MAX_TASK_TEXT_LENGTH}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 p-2 rounded-md min-h-16 bg-surface-600">
      <Checkbox
        checked={task.completed}
        onChange={toggleTaskStatus}
        disabled={isLoading}
        aria-label={`Mark task "${task.text}" as ${
          task.completed ? 'incomplete' : 'complete'
        }`}
      />

      <button
        onClick={isLoading ? undefined : handleEditClick}
        onKeyDown={handleEditKeyDown}
        disabled={isLoading}
        aria-label={`Edit task: ${task.text}`}
        className={cn(
          'flex-1 bg-transparent border-none cursor-text p-0',
          isLoading && 'cursor-not-allowed'
        )}
      >
        <Typography
          variant="body"
          as="span"
          align="left"
          className={cn(task.completed && 'line-through text-gray-400')}
        >
          {task.text}
        </Typography>
      </button>

      <Tooltip content="Delete task" position="left">
        <button
          onClick={handleDeleteClick}
          disabled={isLoading}
          aria-label={`Delete task: ${task.text}`}
          className="text-md text-danger-500 hover:text-danger-600 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDelete size={20} />
        </button>
      </Tooltip>
    </li>
  );
};

export default memo(TaskItem);
