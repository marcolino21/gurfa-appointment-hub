
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Il titolo è obbligatorio'),
  clientId: z.string().min(1, 'Il cliente è obbligatorio'),
  categoryId: z.string().optional(),
  customCategory: z.string().optional(),
  subcategoryId: z.string().optional(),
  description: z.string().optional(),
  objectives: z.array(
    z.object({
      description: z.string(),
      isCompleted: z.boolean()
    })
  ),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.enum(['planning', 'in_progress', 'completed', 'cancelled']),
  progress: z.number().min(0).max(100),
  feedback: z.string().optional(),
  staffIds: z.array(z.string()),
  customFields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['text', 'number', 'date', 'select', 'checkbox']),
      value: z.union([z.string(), z.number(), z.boolean(), z.date(), z.null()]),
      options: z.array(z.string()).optional()
    })
  ).optional()
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
