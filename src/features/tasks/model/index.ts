import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { tasksApi } from './api/tasks';
import tasksEntitiesReducer from './slices/tasksEntitiesSlice';
import tasksFilterReducer from './slices/tasksFilterSlice';
import { listenerMiddleware } from './listenerMiddleware';

const tasksEntitiesPersistConfig = {
  key: 'tasksEntities',
  storage
};

const tasksFilterPersistConfig = {
  key: 'tasksFilter',
  storage
};

export const tasksReducers = {
  [tasksApi.reducerPath]: tasksApi.reducer,
  tasksEntities: persistReducer(
    tasksEntitiesPersistConfig,
    tasksEntitiesReducer
  ),
  tasksFilter: persistReducer(tasksFilterPersistConfig, tasksFilterReducer)
};

export const tasksMiddleware = [
  listenerMiddleware.middleware,
  tasksApi.middleware
];

export { tasksApi } from './api/tasks';
export { listenerMiddleware } from './listenerMiddleware';
export * from './slices';
