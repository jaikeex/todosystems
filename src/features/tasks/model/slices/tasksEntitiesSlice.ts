import {
  createEntityAdapter,
  createSlice,
  type EntityState
} from '@reduxjs/toolkit';
import type { Task } from '@/types/task';
import { tasksApi } from '@/tasks/model/api/tasks';

const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => a.createdDate - b.createdDate
});

export type TasksEntityState = EntityState<Task, string>;

const tasksEntitiesSlice = createSlice({
  name: 'tasksEntities',
  initialState: tasksAdapter.getInitialState(),
  reducers: {
    addTask: tasksAdapter.addOne,
    removeTask: tasksAdapter.removeOne,
    upsertTask: tasksAdapter.upsertOne,
    updateTask: tasksAdapter.updateOne
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      tasksApi.endpoints.getAll.matchFulfilled,
      (state, { payload }) => {
        tasksAdapter.setAll(state, payload);
      }
    );

    builder.addMatcher(
      tasksApi.endpoints.createTask.matchFulfilled,
      (state, { payload }) => {
        tasksAdapter.addOne(state, payload);
      }
    );

    builder.addMatcher(
      tasksApi.endpoints.deleteTask.matchFulfilled,
      (state, action) => {
        const id: string = action.meta.arg.originalArgs;
        tasksAdapter.removeOne(state, id);
      }
    );

    const upsertMatchers = [
      tasksApi.endpoints.updateText.matchFulfilled,
      tasksApi.endpoints.complete.matchFulfilled,
      tasksApi.endpoints.incomplete.matchFulfilled
    ] as const;

    upsertMatchers.forEach((matcher) =>
      builder.addMatcher(matcher, (state, { payload }) => {
        tasksAdapter.upsertOne(state, payload);
      })
    );
  }
});

export default tasksEntitiesSlice.reducer;

export const { addTask, removeTask, upsertTask, updateTask } =
  tasksEntitiesSlice.actions;

export const tasksSelectors = tasksAdapter.getSelectors(
  (state: { tasksEntities: TasksEntityState }) => state.tasksEntities
);
