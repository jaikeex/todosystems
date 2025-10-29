import {
  isRejectedWithValue,
  isRejected,
  type Middleware
} from '@reduxjs/toolkit';
import { setError } from './errorSlice';

interface ApiError {
  data?: unknown;
  error?: string;
  originalStatus?: number;
}

/**
 * Not a very robust check, but feels good enough for how the api is.
 */
const isApiError = (payload: unknown): payload is ApiError => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    ('error' in payload || 'originalStatus' in payload)
  );
};

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejected(action) || isRejectedWithValue(action)) {
    const payload = action.payload;

    if (!isApiError(payload)) {
      store.dispatch(setError('An unexpected error occurred'));
      return next(action);
    }

    let errorMessage = 'An error occurred';

    if (typeof payload.data === 'string') {
      errorMessage = payload.data;
    } else if (payload.error) {
      errorMessage = payload.error;
    } else if (payload.originalStatus) {
      errorMessage = `Request failed with status ${payload.originalStatus}`;
    }

    if (errorMessage.length > 100) {
      errorMessage = errorMessage.slice(0, 100) + '...';
    }

    store.dispatch(setError(errorMessage));
  }

  return next(action);
};
