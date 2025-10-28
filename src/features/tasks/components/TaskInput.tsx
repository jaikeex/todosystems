import { useRef, useCallback } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { useCreateTaskMutation } from '@/store/api/tasks';
import Loader from '@/ui/Loader';

const TaskInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const text = inputRef.current?.value.trim();

      if (!text) {
        return;
      }

      await createTask({ text });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [createTask]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <Input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task"
        disabled={isLoading}
        aria-label="Enter a new task name"
        role="textbox"
        maxLength={100}
      />

      <Button
        type="submit"
        disabled={isLoading}
        aria-label="Submit new task"
        role="button"
      >
        {isLoading ? <Loader size="sm" /> : 'Add'}
      </Button>
    </form>
  );
};

export default TaskInput;
