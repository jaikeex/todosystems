import React from 'react';
import cn from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'danger' | 'ghost';
  outline?: boolean;
}

const colorClass = {
  primary: 'bg-primary-500 hover:bg-primary-600',
  secondary: 'bg-secondary-500 hover:bg-secondary-600',
  danger: 'bg-danger-500 hover:bg-danger-600',
  ghost: 'bg-transparent hover:bg-gray-100'
};

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  color = 'primary',
  outline = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        colorClass[color],
        outline && 'border border-surface-300',
        'text-md inline-flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:bg-surface-300 disabled:opacity-60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
