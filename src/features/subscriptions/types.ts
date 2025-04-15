
import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(1, { message: 'Il nome è obbligatorio' }),
  type: z.enum(['services', 'entries'], { 
    errorMap: () => ({ message: 'Seleziona un tipo di abbonamento' }) 
  }),
  serviceIds: z.array(z.string()).optional().default([]),
  includeAllServices: z.boolean().default(false),
  entriesPerMonth: z.number().optional(),
  price: z.number().min(0, { message: 'Il prezzo non può essere negativo' }),
  discount: z.number().min(0, { message: 'Lo sconto non può essere negativo' }).max(100, { message: 'Lo sconto non può superare il 100%' }).optional(),
  clientId: z.string().min(1, { message: 'Il cliente è obbligatorio' }),
  paymentMethod: z.enum(['credit_card', 'paypal'], {
    errorMap: () => ({ message: 'Seleziona un metodo di pagamento' })
  }),
  recurrenceType: z.enum(['monthly', 'quarterly', 'annually'], {
    errorMap: () => ({ message: 'Seleziona un tipo di ricorrenza' })
  }).default('monthly'),
  cancellableImmediately: z.boolean().default(false),
  minDuration: z.number().min(0).optional(),
  maxDuration: z.number().min(0).optional(),
  sellOnline: z.boolean().default(false),
  geolocationEnabled: z.boolean().default(false),
  geolocationRadius: z.number().min(0).optional(),
  startDate: z.string().min(1, { message: 'La data di inizio è obbligatoria' }),
  endDate: z.string().optional(),
  status: z.enum(['active', 'cancelled', 'expired']).default('active'),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;
