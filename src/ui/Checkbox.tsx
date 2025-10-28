import React from 'react';
import cn from 'classnames';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer gap-2 select-none">
      <input
        type="checkbox"
        className={cn(
          'h-6 w-6 rounded border-gray-300 text-blue-600',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />

      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
};

export default Checkbox;
