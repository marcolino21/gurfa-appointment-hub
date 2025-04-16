
import { z } from 'zod';
import { Service } from '@/types';

export const serviceSchema = z.object({
  name: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  category: z.string().min(1, { message: 'La categoria è obbligatoria' }),
  description: z.string().optional(),
  duration: z.number().min(5, { message: 'La durata deve essere almeno 5 minuti' }),
  price: z.number().min(0, { message: 'Il prezzo non può essere negativo' }),
  color: z.string(),
  assignedStaffIds: z.array(z.string()),
  customCategory: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
