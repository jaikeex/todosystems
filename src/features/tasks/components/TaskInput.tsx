import { useRef, useCallback } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Input, Button, Typography, Loader } from '@/ui';
import { MAX_TASK_TEXT_LENGTH } from '@/constants';
import { setFilter } from '@/tasks/store';
import { useCreateTaskMutation, useGetAllQuery } from '@/tasks/store/api/tasks';
import { setError, clearError } from '@/store/error/errorSlice';
import { useAppDispatch } from '@/store/hooks';
import { twMerge } from 'tailwind-merge';

interface TaskInputProps extends React.HTMLAttributes<HTMLFormElement> {
  className?: string;
}

const TaskInput = ({ className, ...props }: TaskInputProps) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoading: isQueryLoading } = useGetAllQuery(undefined, {
    selectFromResult: ({ isLoading }) => ({ isLoading })
  });
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

      // Should never happen as the input is limited, but just in case
      if (text.length > MAX_TASK_TEXT_LENGTH) {
        dispatch(
          setError(`Task name cannot exceed ${MAX_TASK_TEXT_LENGTH} characters`)
        );
        return;
      }

      try {
        await createTask({ text }).unwrap();
        dispatch(setFilter('all'));

        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } catch {
        /**
         * no need to anything here, the error middleware handles this,
         * but unwraping the call causes an error to be thrown.
         */
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
      className={twMerge('flex gap-2 w-full max-w-xl', className)}
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
        disabled={isLoading || isQueryLoading}
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
