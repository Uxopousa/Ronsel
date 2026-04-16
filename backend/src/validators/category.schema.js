import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color hex inválido').default('#6366f1'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});
