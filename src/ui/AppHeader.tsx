import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Typography, RequestStatusIndicator } from '@/ui';
import { FaGithub } from 'react-icons/fa';
import { APP_NAME, GITHUB_URL } from '@/constants';

interface AppHeaderProps {
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className }) => {
  return (
    <header
      className={twMerge(
        'w-full bg-surface-900 text-text-primary shadow-md sticky top-0 z-10',
        className
      )}
    >
      <div className="w-full mx-auto flex items-center justify-between px-4 py-4 gap-4">
        <Typography as="span" variant="heading-sm" className="select-none">
          {APP_NAME}
        </Typography>

        <div className="flex items-center gap-4 ml-auto">
          <RequestStatusIndicator />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub page of the project in new tab"
            className="hover:text-secondary-200 transition-colors duration-200"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
