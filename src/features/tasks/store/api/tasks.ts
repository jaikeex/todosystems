import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';
import { TaskSchema, TaskPayloadSchema } from '@/tasks/types';
import type { Task, TaskPayload } from '@/tasks/types';

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
      transformResponse: (response: unknown) => TaskSchema.parse(response)
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
      transformResponse: (response: unknown) => TaskSchema.parse(response)
    }),

    complete: builder.mutation<Task, string>({
      query: (id) => ({ url: `/tasks/${id}/complete`, method: 'POST' }),
      transformResponse: (response: unknown) => TaskSchema.parse(response)
    }),

    incomplete: builder.mutation<Task, string>({
      query: (id) => ({ url: `/tasks/${id}/incomplete`, method: 'POST' }),
      transformResponse: (response: unknown) => TaskSchema.parse(response)
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
