import React from 'react';
import cn from 'classnames';
import { Typography } from './Typography';

interface FilterBadgeProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({
  label,
  count,
  active,
  onClick,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
        'cursor-pointer',
        active
          ? 'bg-primary-100 text-primary-700 border border-primary-300'
          : 'bg-surface-700 text-text-secondary border border-transparent hover:border-surface-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={`Filter by ${label}`}
      aria-pressed={active}
      role="button"
    >
      <Typography as="span" variant="label" className="capitalize font-medium">
        {label}
      </Typography>
      <Typography
        as="span"
        variant="label"
        className={cn(
          'text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-6 text-center',
          active
            ? 'bg-surface-200 text-primary-800'
            : 'bg-gray-200 text-gray-700'
        )}
      >
        {count}
      </Typography>
    </button>
  );
};

export default FilterBadge;
