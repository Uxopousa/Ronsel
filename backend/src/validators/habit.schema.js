import { z } from 'zod';

const daysOfWeekSchema = z.array(z.number().int().min(0).max(6)).optional();
const biweeklySchema = z.object({
  week1: z.array(z.number().int().min(0).max(6)),
  week2: z.array(z.number().int().min(0).max(6)),
}).optional();

export const createHabitSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY']).default('DAILY'),
  targetPerWeek: z.number().int().min(1).optional(),
  daysOfWeek: z.union([daysOfWeekSchema, biweeklySchema]).optional(),
  categoryId: z.string().optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY']).optional(),
  targetPerWeek: z.number().int().min(1).optional(),
  daysOfWeek: z.union([daysOfWeekSchema, biweeklySchema]).optional(),
  categoryId: z.string().nullable().optional(),
});
