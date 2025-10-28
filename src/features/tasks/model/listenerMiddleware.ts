import { createListenerMiddleware } from '@reduxjs/toolkit';
import { tasksApi } from '@/features/tasks/model/api/tasks';
import {
  addTask,
  removeTask,
  upsertTask,
  updateTask
} from '@/features/tasks/model';
import type { Task } from '@/types/task';
import type { RootState, AppDispatch } from '@/store';

/**
 * Handles optimistic updates for the ui.
 * Not really sure if this is considered a good practice in redux, since most examples i found
 * were using onQueryStarted, but once i learned that the listenerMiddleware exists this seemed
 * like an obvious use case. Declaratively hooking into the mutations like this just works better
 * for me in my brain.
 *
 * Also these declarations are a bit verbose. A factory of some kind would come a long way here. Maybe later...
 */

export const listenerMiddleware = createListenerMiddleware();

// enables type inference for the listeners
export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

startAppListening({
  matcher: tasksApi.endpoints.createTask.matchPending,
  async effect(action, { dispatch, take }) {
    const args = action.meta.arg.originalArgs;
    const createdDate = Date.now();
    const tempId = `temp-${createdDate}`;

    const tempTask: Task = {
      id: tempId,
      text: args.text,
      completed: false,
      createdDate
    };

    dispatch(addTask(tempTask));

    const [resultAction] = await take(
      (a) =>
        (tasksApi.endpoints.createTask.matchFulfilled(a) ||
          tasksApi.endpoints.createTask.matchRejected(a)) &&
        a.meta.requestId === action.meta.requestId
    );

    dispatch(removeTask(tempId));

    if (tasksApi.endpoints.createTask.matchFulfilled(resultAction)) {
      dispatch(upsertTask(resultAction.payload));
    }

    if (tasksApi.endpoints.createTask.matchRejected(resultAction)) {
      dispatch(tasksApi.util.invalidateTags(['Tasks']));
    }
  }
});

startAppListening({
  matcher: tasksApi.endpoints.updateText.matchPending,
  async effect(action, { dispatch, take, getState }) {
    const { id, text } = action.meta.arg.originalArgs;
    const originalText = getState().tasksEntities.entities[id]?.text;

    // call this AFTER extracting the original text (yes i spent 10 minutes figuring this out...)
    dispatch(updateTask({ id, changes: { text } }));

    const [resultAction] = await take(
      (a) =>
        (tasksApi.endpoints.updateText.matchFulfilled(a) ||
          tasksApi.endpoints.updateText.matchRejected(a)) &&
        a.meta.requestId === action.meta.requestId
    );

    if (tasksApi.endpoints.updateText.matchRejected(resultAction)) {
      dispatch(updateTask({ id, changes: { text: originalText } }));
      dispatch(tasksApi.util.invalidateTags(['Tasks']));
    }
  }
});

startAppListening({
  matcher: tasksApi.endpoints.complete.matchPending,
  async effect(action, { dispatch, take }) {
    const id = action.meta.arg.originalArgs;
    dispatch(updateTask({ id, changes: { completed: true } }));

    const [resultAction] = await take(
      (a) =>
        (tasksApi.endpoints.complete.matchFulfilled(a) ||
          tasksApi.endpoints.complete.matchRejected(a)) &&
        a.meta.requestId === action.meta.requestId
    );

    if (tasksApi.endpoints.complete.matchRejected(resultAction)) {
      dispatch(updateTask({ id, changes: { completed: false } }));
      dispatch(tasksApi.util.invalidateTags(['Tasks']));
    }
  }
});

startAppListening({
  matcher: tasksApi.endpoints.incomplete.matchPending,
  async effect(action, { dispatch, take }) {
    const id = action.meta.arg.originalArgs;
    dispatch(updateTask({ id, changes: { completed: false } }));

    const [resultAction] = await take(
      (a) =>
        (tasksApi.endpoints.incomplete.matchFulfilled(a) ||
          tasksApi.endpoints.incomplete.matchRejected(a)) &&
        a.meta.requestId === action.meta.requestId
    );

    if (tasksApi.endpoints.incomplete.matchRejected(resultAction)) {
      dispatch(updateTask({ id, changes: { completed: true } }));
      dispatch(tasksApi.util.invalidateTags(['Tasks']));
    }
  }
});
