import {
  isRejectedWithValue,
  isRejected,
  type Middleware
} from '@reduxjs/toolkit';
import { setError } from './errorSlice';

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejected(action) || isRejectedWithValue(action)) {
    const error = action.payload as {
      data?: string;
      error?: string;
      originalStatus?: number;
    };

    const endpoint = (action.meta as { arg?: { endpointName?: string } })?.arg
      ?.endpointName;

    let errorMessage = endpoint
      ? `Request "${endpoint}" failed`
      : 'An error occurred';

    if (error.data) {
      errorMessage =
        typeof error.data === 'string'
          ? error.data
          : JSON.stringify(error.data);
    } else if (error.error) {
      errorMessage = error.error;
    } else if (error.originalStatus) {
      errorMessage = `Request failed with status ${error.originalStatus}`;
    }

    errorMessage = errorMessage.slice(0, 100).concat('...');

    store.dispatch(setError(errorMessage));
  }

  return next(action);
};
