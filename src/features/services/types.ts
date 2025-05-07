
import { z } from 'zod';
import { Service } from '@/types';

export const serviceSchema = z.object({
  name: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  category: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().min(5, { message: 'La durata deve essere almeno 5 minuti' }),
  tempoDiPosa: z.number().min(0, { message: 'Il tempo di posa non può essere negativo' }).default(0),
  price: z.number().min(0, { message: 'Il prezzo non può essere negativo' }),
  color: z.string(),
  assignedStaffIds: z.array(z.string()),
  customCategory: z.string().optional(),
}).refine(data => {
  // Validate that either category or customCategory is provided
  return (!!data.category && data.category.length > 0) || 
         (!!data.customCategory && data.customCategory.length > 0);
}, {
  message: "È necessario selezionare una categoria o inserire una categoria personalizzata",
  path: ["category"]
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
