import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';
import { TaskSchema, TaskPayloadSchema } from '@/features/tasks/types';
import type { Task, TaskPayload } from '@/features/tasks/types';
import { addFlashTask } from '../slices/flashSlice';

/**
 * Decided to give rtk query a shot since it was suggested in the requirements.
 * This implementation uses server responses to keep the cache in sync. Invalidating a 3s query
 * on every mutation is madness (i know this is a mock delay but if this was a real expensive query
 * it would make zero sense).
 * I hate how verbose this is. I tried some things to make it more declarative, but all led
 * to complexity hardly acceptable for this kind of project. The closest i got was by using
 * listenerMiddleware to hook into the mutations, i might still revisit this approach if i have the time.
 */

const TASKS_TAG = 'Tasks' as const;

const sortTasks = (tasks: Task[]) =>
  tasks.slice().sort((a, b) => b.createdDate - a.createdDate);

const TasksArraySchema = z.array(TaskSchema);

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
  }),
  tagTypes: [TASKS_TAG],
  endpoints: (builder) => ({
    getAll: builder.query<Task[], void>({
      query: () => '/tasks',
      transformResponse: (response: unknown) =>
        sortTasks(TasksArraySchema.parse(response)),
      providesTags: [TASKS_TAG]
    }),

    createTask: builder.mutation<Task, TaskPayload>({
      query: ({ text }) => {
        TaskPayloadSchema.parse({ text });
        return {
          url: '/tasks',
          method: 'POST',
          body: { text }
        };
      },
      transformResponse: (response: unknown) => TaskSchema.parse(response),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const now = Date.now();
        const tempTask: Task = {
          id: `temp-${now}-${Math.random().toString(36).substring(2, 15)}`,
          text: args.text,
          completed: false,
          createdDate: now
        };

        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
            draft.unshift(tempTask);
          })
        );

        try {
          const { data: newTask } = await queryFulfilled;

          dispatch(
            tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
              const task = draft.find((t) => t.id === tempTask.id);
              if (task) {
                Object.assign(task, newTask);
              }
            })
          );

          dispatch(addFlashTask(newTask.id));
        } catch {
          patchResult.undo();
        }
      }
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        /**
         * This is not updated opttimistically on purpose. If the call fails it looks bad since
         * many list items shift positions at the same time, and it proved surprisingly hard
         * to reconcile the ui state if only some calls fail during bulk deletion...
         */
        try {
          await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
              const task = draft.find((t) => t.id === id);
              if (task) {
                draft.splice(draft.indexOf(task), 1);
              }
            })
          );
        } catch {
          // nothing to see here
        }
      }
    }),

    updateText: builder.mutation<Task, { id: string; text: string }>({
      query: ({ id, text }) => {
        TaskPayloadSchema.parse({ text });
        return {
          url: `/tasks/${id}`,
          method: 'POST',
          body: { text }
        };
      },
      transformResponse: (response: unknown) => TaskSchema.parse(response),
      async onQueryStarted({ id, text }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
            const task = draft.find((t) => t.id === id);
            if (task) {
              task.text = text;
            }
          })
        );

        try {
          const { data: updatedTask } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
              const task = draft.find((t) => t.id === id);
              if (task) {
                Object.assign(task, updatedTask);
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      }
    }),

    complete: builder.mutation<Task, string>({
      query: (id) => ({ url: `/tasks/${id}/complete`, method: 'POST' }),
      transformResponse: (response: unknown) => TaskSchema.parse(response),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
            const task = draft.find((t) => t.id === id);
            if (task) {
              task.completed = true;
            }
          })
        );

        try {
          const { data: updatedTask } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
              const task = draft.find((t) => t.id === id);
              if (task) {
                Object.assign(task, updatedTask);
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      }
    }),

    incomplete: builder.mutation<Task, string>({
      query: (id) => ({ url: `/tasks/${id}/incomplete`, method: 'POST' }),
      transformResponse: (response: unknown) => TaskSchema.parse(response),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
            const task = draft.find((t) => t.id === id);
            if (task) {
              task.completed = false;
            }
          })
        );

        try {
          const { data: updatedTask } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData('getAll', undefined, (draft) => {
              const task = draft.find((t) => t.id === id);
              if (task) {
                Object.assign(task, updatedTask);
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      }
    })
  })
});

export const {
  useGetAllQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTextMutation,
  useCompleteMutation,
  useIncompleteMutation
} = tasksApi;
