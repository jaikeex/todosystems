import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { tasksApi } from './api/tasks';
import tasksFilterReducer from './slices/tasksFilterSlice';

const tasksFilterPersistConfig = {
  key: 'tasksFilter',
  storage
};

export const tasksReducers = {
  [tasksApi.reducerPath]: tasksApi.reducer,
  tasksFilter: persistReducer(tasksFilterPersistConfig, tasksFilterReducer)
};

export const tasksMiddleware = [tasksApi.middleware];

export { tasksApi } from './api/tasks';
export * from './slices';
