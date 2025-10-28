import { useRef, useCallback } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { useCreateTaskMutation } from '@/store/api/tasks';
import Loader from '@/ui/Loader';
import { Typography } from '@/ui/Typography';
import cn from 'classnames';
import { setError, clearError } from '@/store/error/errorSlice';
import { useAppDispatch } from '@/store/hooks';
import { MAX_TASK_TEXT_LENGTH } from '@/constants';
import { setFilter } from '@/store/tasks/taskFilterSlice';

interface TaskInputProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
}

const TaskInput = ({ className, ...props }: TaskInputProps) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const text = inputRef.current?.value.trim();

      if (!text) {
        dispatch(setError('Task name is required'));
        return;
      } else {
        dispatch(clearError());
      }

      await createTask({ text })
        .unwrap()
        .then(() => {
          dispatch(setFilter('all'));
        });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [createTask, dispatch]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex gap-2 w-full max-w-xl', className)}
      {...props}
    >
      <Input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Enter a new task name"
        disabled={isLoading}
        aria-label="Enter a new task name"
        maxLength={MAX_TASK_TEXT_LENGTH}
      />

      <Button
        type="submit"
        disabled={isLoading}
        aria-label="Submit new task"
        className="w-24 h-10"
      >
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <Typography variant="body" className="text-surface-800 font-semibold">
            Add
          </Typography>
        )}
      </Button>
    </form>
  );
};

export default TaskInput;
