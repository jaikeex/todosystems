export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdDate: number;
  completedDate?: number;
};

export type TaskPayload = Pick<Task, 'text'>;

import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Task text cannot be empty'),
  completed: z.boolean(),
  createdDate: z.number(),
  completedDate: z.number().optional()
});

export const TaskPayloadSchema = TaskSchema.pick({ text: true });
