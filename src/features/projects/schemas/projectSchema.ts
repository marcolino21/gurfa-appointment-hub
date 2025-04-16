
import { z } from 'zod';

export const objectiveSchema = z.object({
  description: z.string().min(1, "La descrizione dell'obiettivo è obbligatoria"),
  isCompleted: z.boolean().default(false)
});

export const customFieldSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Il nome del campo è obbligatorio"),
  type: z.enum(['text', 'number', 'date', 'select', 'checkbox']),
  value: z.union([z.string(), z.number(), z.boolean(), z.date(), z.null()]),
  options: z.array(z.string()).optional()
});

export const projectSchema = z.object({
  title: z.string().min(1, "Il titolo del progetto è obbligatorio"),
  clientId: z.string().min(1, "Il cliente è obbligatorio"),
  categoryId: z.string().min(1, "La categoria è obbligatoria"),
  subcategoryId: z.string().optional(),
  description: z.string().optional(),
  objectives: z.array(objectiveSchema),
  startDate: z.string().min(1, "La data di inizio è obbligatoria"),
  endDate: z.string().optional(),
  status: z.enum(['planning', 'in_progress', 'completed', 'cancelled']),
  progress: z.number().min(0).max(100).default(0),
  feedback: z.string().optional(),
  staffIds: z.array(z.string()),
  customFields: z.array(customFieldSchema)
});

export type ProjectSchema = z.infer<typeof projectSchema>;
