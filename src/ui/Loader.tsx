import React from 'react';
import { Typography } from '@/ui';
import { FaReact } from 'react-icons/fa';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-label="Loading..."
      aria-live="polite"
    >
      <FaReact
        className={`${sizeClasses[size]} animate-spin text-secondary-400`}
      />
      <Typography as="span" variant="body" className="sr-only">
        Loading...
      </Typography>
    </div>
  );
};

export default Loader;
