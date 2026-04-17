import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY']).default('DAILY'),
  targetPerWeek: z.number().int().min(1).optional(),
  categoryId: z.string().optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY']).optional(),
  targetPerWeek: z.number().int().min(1).optional(),
  categoryId: z.string().nullable().optional(),
});
