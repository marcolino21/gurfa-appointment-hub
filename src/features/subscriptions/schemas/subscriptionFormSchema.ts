
import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1, { message: "Nome abbonamento è obbligatorio" }),
  type: z.enum(['services', 'entries']),
  serviceIds: z.array(z.string()).default([]),
  includeAllServices: z.boolean().default(false),
  entriesPerMonth: z.number().optional(),
  price: z.number().min(0),
  discount: z.number().min(0).default(0),
  clientId: z.string().min(1, { message: "Cliente è obbligatorio" }),
  paymentMethod: z.enum(['credit_card']).default('credit_card'),
  recurrenceType: z.enum(['monthly', 'quarterly', 'annually']),
  cancellableImmediately: z.boolean().default(false),
  minDuration: z.number().optional(),
  maxDuration: z.number().optional(),
  sellOnline: z.boolean().default(false),
  geolocationEnabled: z.boolean().default(false),
  geolocationRadius: z.number().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'cancelled', 'expired']).default('active'),
});
