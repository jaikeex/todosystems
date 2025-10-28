import type { Task } from '@/tasks/types';
import { Typography, Checkbox, Tooltip } from '@/ui';
import { FiDelete } from 'react-icons/fi';
import cn from 'classnames';

interface TaskItemDisplayProps {
  task: Task;
  isLoading: boolean;
  onToggleStatus: () => void;
  onEditClick: () => void;
  onEditKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onDeleteClick: () => void;
}

const TaskItemDisplay: React.FC<TaskItemDisplayProps> = ({
  task,
  isLoading,
  onToggleStatus,
  onEditClick,
  onEditKeyDown,
  onDeleteClick
}) => {
  return (
    <li className="flex items-center gap-3 p-2 rounded-md min-h-16 bg-surface-600">
      <Checkbox
        checked={task.completed}
        onChange={onToggleStatus}
        disabled={isLoading}
        aria-label={`Mark task "${task.text}" as ${
          task.completed ? 'incomplete' : 'complete'
        }`}
      />

      <button
        onClick={!isLoading ? onEditClick : undefined}
        onKeyDown={onEditKeyDown}
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
          onClick={onDeleteClick}
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

export default TaskItemDisplay;
