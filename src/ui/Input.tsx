import React from 'react';
import cn from 'classnames';
import { Typography } from '@/ui';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <input
          {...props}
          id={id}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-lg',
            'transition-colors duration-200 focus:outline-none focus:ring-2',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error
              ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
              : 'border-surface-300 focus:ring-primary-500 focus:border-primary-500',
            className
          )}
        />

        {error && (
          <Typography
            as="p"
            variant="error"
            className="absolute -bottom-5 left-0 text-sm text-danger-500"
            role="alert"
          >
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
