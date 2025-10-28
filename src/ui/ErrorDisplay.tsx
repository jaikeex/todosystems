import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError } from '@/store/error/errorSlice';
import { Typography } from './Typography';

const ErrorDisplay = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.error);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error.message) {
      const timer = setTimeout(() => {
        handleClearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error.timestamp, error.message, handleClearError]);

  if (!error.message) return null;

  return (
    <div
      className="max-w-xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed top-2 left-2 right-2 mx-auto"
      role="alert"
      onClick={handleClearError}
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
