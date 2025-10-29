import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { tasksApi } from './api/tasks';
import tasksFilterReducer from './slices/tasksFilterSlice';
import flashReducer from './slices/flashSlice';

const tasksFilterPersistConfig = {
  key: 'tasksFilter',
  storage
};

export const tasksReducers = {
  [tasksApi.reducerPath]: tasksApi.reducer,
  tasksFilter: persistReducer(tasksFilterPersistConfig, tasksFilterReducer),
  flash: flashReducer
};

export const tasksMiddleware = [tasksApi.middleware];

export { tasksApi } from './api/tasks';
export * from './slices/tasksFilterSlice';
export * from './slices/flashSlice';
