import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

const colorClass = {
  primary: 'bg-primary-500 hover:bg-primary-600',
  secondary: 'bg-secondary-500 hover:bg-secondary-600',
  danger: 'bg-danger-500 hover:bg-danger-600',
  ghost: 'bg-transparent hover:bg-surface-600'
};

const sizeClass = {
  small: 'px-2 py-1 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg'
};

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  color = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <button
      className={twMerge(
        colorClass[color],
        sizeClass[size],
        'inline-flex items-center justify-center rounded-md cursor-pointer transition-colors duration-200',
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
