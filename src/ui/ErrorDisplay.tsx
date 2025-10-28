import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/error/errorSlice';
import { Typography } from './Typography';
import { ERROR_DISPLAY_DURATION } from '@/constants';

const ErrorDisplay = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.error);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleClearError();
      }
    },
    [handleClearError]
  );

  useEffect(() => {
    if (error.message) {
      const timer = setTimeout(() => {
        handleClearError();
      }, ERROR_DISPLAY_DURATION);

      return () => clearTimeout(timer);
    }
  }, [error.timestamp, error.message, handleClearError]);

  if (!error.message) return null;

  return (
    <div
      className="max-w-xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed top-2 left-2 right-2 mx-auto z-50 cursor-pointer"
      role="alert"
      onClick={handleClearError}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Typography as="strong" variant="body" className="font-bold">
            Error:&nbsp;
          </Typography>
          <Typography as="span" variant="body" className="block sm:inline">
            {error.message}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
