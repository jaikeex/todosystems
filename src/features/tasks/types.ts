import { z } from 'zod';
import { MAX_TASK_TEXT_LENGTH } from '@/constants';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number;
  completedDate?: number | undefined;
};

export type TaskPayload = Pick<Task, 'text'>;

const timestampSchema = z
  .union([z.number(), z.string().regex(/^\d+$/)])
  .transform((v) => Number(v));

export const TaskSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .min(1, 'Task text cannot be empty')
    .max(
      MAX_TASK_TEXT_LENGTH,
      `Task text cannot exceed ${MAX_TASK_TEXT_LENGTH} characters`
    ),
  completed: z.boolean(),
  createdDate: timestampSchema,
  completedDate: timestampSchema.optional()
});

export const TaskPayloadSchema = TaskSchema.pick({ text: true });

export type Filter = 'all' | 'done' | 'active';
