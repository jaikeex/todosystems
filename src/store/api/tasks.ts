import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';
import { TaskSchema, TaskPayloadSchema } from '../../types/task';
import type { Task, TaskPayload } from '../../types/task';
import {
  addTask,
  removeTask,
  upsertTask,
  updateTask
} from '../tasks/tasksEntitiesSlice';

const TASKS_TAG = 'Tasks' as const;

const sortTasks = (tasks: Task[]) =>
  tasks.slice().sort((a, b) => a.createdDate - b.createdDate);

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

    getCompleted: builder.query<Task[], void>({
      query: () => '/tasks/completed',
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
      async onQueryStarted({ text }, { dispatch, queryFulfilled }) {
        const tempId = `${Date.now()}-${Math.random().toString(36).slice(2)}`; // copilot did this
        const createdDate = Date.now();

        dispatch(
          addTask({ id: tempId, text, completed: false, createdDate } as Task)
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(removeTask(tempId));
          dispatch(upsertTask(data));
        } catch {
          dispatch(removeTask(tempId));
          dispatch(tasksApi.util.invalidateTags([TASKS_TAG]));
        }
      }
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' })
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
        dispatch(updateTask({ id, changes: { text } }));

        try {
          const { data } = await queryFulfilled;
          dispatch(upsertTask(data));
        } catch {
          dispatch(tasksApi.util.invalidateTags([TASKS_TAG]));
        }
      }
    }),

    complete: builder.mutation<Task, string>({
      query: (id) => ({ url: `/tasks/${id}/complete`, method: 'POST' }),
      transformResponse: (response: unknown) => TaskSchema.parse(response),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(updateTask({ id, changes: { completed: true } }));

        try {
          const { data } = await queryFulfilled;
          dispatch(upsertTask(data));
        } catch {
          dispatch(tasksApi.util.invalidateTags([TASKS_TAG]));
        }
      }
    }),

    incomplete: builder.mutation<Task, string>({
      query: (id) => ({ url: `/tasks/${id}/incomplete`, method: 'POST' }),
      transformResponse: (response: unknown) => TaskSchema.parse(response),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(updateTask({ id, changes: { completed: false } }));

        try {
          const { data } = await queryFulfilled;
          dispatch(upsertTask(data));
        } catch {
          dispatch(tasksApi.util.invalidateTags([TASKS_TAG]));
        }
      }
    })
  })
});

export const {
  useGetAllQuery,
  useGetCompletedQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTextMutation,
  useCompleteMutation,
  useIncompleteMutation
} = tasksApi;
