import React from 'react';
import cn from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'danger' | 'ghost';
  outline?: boolean;
}

const colorClass = {
  primary: 'bg-primary-200 hover:bg-primary-300',
  secondary: 'bg-green-400 hover:bg-green-500',
  danger: 'bg-red-400 hover:bg-red-500',
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
        outline && 'border border-gray-300',
        'text-md inline-flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
