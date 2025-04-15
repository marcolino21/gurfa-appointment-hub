
import { Client } from '@/types';
import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  lastName: z.string().min(1, { message: 'Il cognome è obbligatorio' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email non valida' }).optional().or(z.literal('')),
  gender: z.enum(['M', 'F', 'O']),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  fiscalCode: z.string().optional(),
  loyaltyCode: z.string().optional(),
  notes: z.string().optional(),
  isPrivate: z.boolean(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
