import React from 'react';
import cn from 'classnames';
import { Typography } from './Typography';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer gap-2 select-none transition-colors duration-200">
      <input
        type="checkbox"
        className={cn(
          'h-6 w-6 rounded border-surface-300 transition-colors duration-200',
          'accent-primary-500',
          'checked:bg-primary-500 checked:border-primary-500',
          'focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />

      {label ? (
        <Typography as="span" variant="body" className="text-text-secondary">
          {label}
        </Typography>
      ) : null}
    </label>
  );
};

export default Checkbox;
