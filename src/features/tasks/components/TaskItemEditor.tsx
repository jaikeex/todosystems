import Input from '@/ui/Input';
import { MAX_TASK_TEXT_LENGTH } from '@/constants';
import type { KeyboardEvent, ChangeEvent } from 'react';

interface TaskItemEditorProps {
  text: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const TaskItemEditor: React.FC<TaskItemEditorProps> = ({
  text,
  onChange,
  onBlur,
  onKeyDown
}) => {
  return (
    <li className="flex items-center gap-3 p-2 rounded-md min-h-16 bg-surface-600">
      <Input
        value={text}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoFocus
        className="flex-1"
        aria-label="Edit task name"
        maxLength={MAX_TASK_TEXT_LENGTH}
      />
    </li>
  );
};

export default TaskItemEditor;
