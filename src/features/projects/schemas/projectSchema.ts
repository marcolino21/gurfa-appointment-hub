
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, "Il titolo è obbligatorio"),
  clientId: z.string().min(1, "Il cliente è obbligatorio"),
  categoryId: z.string().optional(),
  customCategory: z.string().optional(),
  subcategoryId: z.string().optional(),
  description: z.string().optional(),
  objectives: z.array(
    z.object({
      description: z.string(),
      isCompleted: z.boolean().default(false)
    })
  ),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.enum(['planning', 'in_progress', 'completed', 'cancelled']),
  progress: z.number().min(0).max(100).default(0),
  feedback: z.string().optional(),
  staffIds: z.array(z.string()).default([]),
  customFields: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      type: z.enum(['text', 'number', 'date', 'select', 'checkbox']),
      value: z.union([z.string(), z.number(), z.boolean(), z.date(), z.null()]),
      options: z.array(z.string()).optional()
    })
  ).default([])
}).refine(data => {
  // Ensure either categoryId or customCategory is provided
  return !!data.categoryId || !!data.customCategory;
}, {
  message: "È necessario selezionare una categoria o inserire una categoria personalizzata",
  path: ["categoryId"]
});
