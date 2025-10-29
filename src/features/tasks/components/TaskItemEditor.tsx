import { useState, useCallback } from 'react';
import { Input } from '@/ui';
import { MAX_TASK_TEXT_LENGTH } from '@/constants';
import type { Task } from '@/features/tasks/types';
import { useUpdateTextMutation } from '@/features/tasks/store/api/tasks';
import { TaskPayloadSchema } from '@/features/tasks/types';
import { z } from 'zod';
import { useAppDispatch } from '@/store/hooks';
import { setError } from '@/store/error/errorSlice';

interface TaskItemEditorProps {
  task: Task;
  onComplete: () => void;
}

const TaskItemEditor: React.FC<TaskItemEditorProps> = ({
  task,
  onComplete
}) => {
  const [text, setText] = useState(task.text);
  const dispatch = useAppDispatch();
  const [updateText] = useUpdateTextMutation();

  const handleSave = useCallback(async () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setText(task.text);
      onComplete();
      return;
    }

    try {
      TaskPayloadSchema.parse({ text: trimmedText });
    } catch (e) {
      setText(task.text);
      onComplete();

      if (e instanceof z.ZodError) {
        dispatch(setError(e.issues[0]?.message ?? 'Invalid task name'));
      } else {
        dispatch(setError('Invalid task name'));
      }
      return;
    }

    if (trimmedText === task.text) {
      onComplete();
      return;
    }

    try {
      await updateText({ id: task.id, text: trimmedText }).unwrap();
    } catch {
      setText(task.text);
    }

    onComplete();
  }, [text, task.id, task.text, updateText, dispatch, onComplete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSave();
      if (e.key === 'Escape') onComplete();
    },
    [handleSave, onComplete]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

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
};

export default TaskItemEditor;
