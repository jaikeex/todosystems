import { memo, useState, useCallback, useMemo } from 'react';
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
import { TrashIcon } from '@heroicons/react/24/solid';

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

  const isLoading = useMemo(
    () => isCompleting || isIncompleting || isDeleting || isUpdating,
    [isCompleting, isIncompleting, isDeleting, isUpdating]
  );

  const toggleTaskStatus = useCallback(() => {
    if (task.completed) {
      incomplete(task.id);
    } else {
      complete(task.id);
    }
  }, [task.completed, task.id, incomplete, complete]);

  const handleSave = useCallback(() => {
    if (text.trim() && text !== task.text) {
      updateText({ id: task.id, text });
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

  const handleDeleteClick = useCallback(() => {
    deleteTask(task.id);
  }, [task.id, deleteTask]);

  if (editing) {
    return (
      <li className="flex items-center gap-3 p-2 bg-gray-100 rounded-md min-h-16">
        <Input
          value={text}
          onChange={handleInputChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1"
          aria-label="Edit task name"
          role="textbox"
          maxLength={100}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 p-2 bg-gray-100 rounded-md min-h-16">
      <Checkbox
        checked={task.completed}
        onChange={toggleTaskStatus}
        disabled={isLoading}
        aria-label="Toggle task status"
        role="checkbox"
      />

      <span
        onClick={isLoading ? undefined : handleEditClick}
        className={cn(
          'flex-1',
          task.completed && 'line-through text-gray-400',
          isLoading && 'cursor-not-allowed'
        )}
      >
        {task.text}
      </span>

      <button
        onClick={handleDeleteClick}
        aria-label="Delete task"
        role="button"
        className="text-md text-red-700 hover:text-red-600 cursor-pointer transition-colors duration-200"
      >
        <TrashIcon className="w-6 h-6" />
      </button>
    </li>
  );
};

export default memo(TaskItem);
