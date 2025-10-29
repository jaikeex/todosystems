import React, { useState, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
};

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-surface-500',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-surface-500',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-surface-500',
  right:
    'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-surface-500'
};

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleMouseEnter = useCallback((): void => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback((): void => {
    setIsVisible(false);
  }, []);

  return (
    <div
      className={twMerge('relative inline-flex items-center', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible ? (
        <div
          className={twMerge(
            'absolute z-50 px-3 py-2 text-sm text-text-primary bg-surface-500 rounded-lg shadow-lg whitespace-nowrap',
            'animate-in fade-in zoom-in-95 duration-200',
            positionClasses[position]
          )}
          role="tooltip"
        >
          {content}
          <div
            className={twMerge(
              'absolute w-0 h-0 border-4',
              arrowClasses[position]
            )}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Tooltip;
