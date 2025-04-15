
import { z } from 'zod';

export const staffSchema = z.object({
  firstName: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  lastName: z.string().optional(),
  email: z.string().email({ message: 'Email non valida' }),
  phone: z.string().optional(),
  additionalPhone: z.string().optional(),
  country: z.string().optional(),
  birthDate: z.string().optional(),
  position: z.string().optional(),
  color: z.string(),
  isActive: z.boolean().default(true),
  showInCalendar: z.boolean().default(true),
  assignedServiceIds: z.array(z.string()),
});

export type StaffFormValues = z.infer<typeof staffSchema>;
