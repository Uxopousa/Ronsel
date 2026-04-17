import { z } from 'zod';

export const createGoalSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  targetDate: z.string().datetime().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  targetDate: z.string().datetime().nullable().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

export const createMilestoneSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  dueDate: z.string().datetime().optional(),
});

export const updateMilestoneSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});
