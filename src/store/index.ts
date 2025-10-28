import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { tasksApi } from './api/tasks';
import taskFilterSlice from './tasks/taskFilterSlice';
import tasksEntitiesReducer from './tasks/tasksEntitiesSlice';
import errorReducer from './error/errorSlice';
import { errorMiddleware } from './error/errorMiddleware';

// redux-persist imports
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combine reducers first so we can persist selected slices
const rootReducer = combineReducers({
  [tasksApi.reducerPath]: tasksApi.reducer,
  tasksEntities: tasksEntitiesReducer,
  taskFilter: taskFilterSlice,
  error: errorReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tasksEntities', 'taskFilter'] // only persist these slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(tasksApi.middleware, errorMiddleware)
});

// Create the persistor for PersistGate
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
