import { configureStore } from '@reduxjs/toolkit';
import { tasksReducers, tasksMiddleware } from '@/features/tasks/store';
import errorReducer from './error/errorSlice';
import { errorMiddleware } from './error/errorMiddleware';

import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

export const store = configureStore({
  reducer: {
    ...tasksReducers,
    error: errorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(...tasksMiddleware, errorMiddleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
