
import * as z from 'zod';

export const freelanceFormSchema = z.object({
  first_name: z.string().min(1, 'Il nome è obbligatorio'),
  last_name: z.string().min(1, 'Il cognome è obbligatorio'),
  email: z.string().email('Inserisci una email valida'),
  vat_number: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  pec_email: z.string().email('Inserisci una PEC valida').optional(),
  sdi_code: z.string().optional(),
  specialization: z.string().optional(),
});
