import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { setError } from './errorSlice';

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as {
      data?: string;
      error?: string;
      status?: number;
    };

    let errorMessage = 'An error occurred';

    if (error.data) {
      errorMessage =
        typeof error.data === 'string'
          ? error.data
          : JSON.stringify(error.data);
    } else if (error.error) {
      errorMessage = error.error;
    } else if (error.status) {
      errorMessage = `Request failed with status ${error.status}`;
    }

    store.dispatch(setError(errorMessage));
  }

  return next(action);
};
