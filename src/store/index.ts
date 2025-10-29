import { configureStore } from '@reduxjs/toolkit';
import { tasksReducers, tasksMiddleware } from '@/features/tasks/store';
import errorReducer from './error/errorSlice';
import { errorMiddleware } from './error/errorMiddleware';

import { persistStore } from 'redux-persist';

export const store = configureStore({
  reducer: {
    ...tasksReducers,
    error: errorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'tasksApi']
      }
    }).concat(...tasksMiddleware, errorMiddleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
