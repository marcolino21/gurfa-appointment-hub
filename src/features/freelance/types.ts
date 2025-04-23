
import { z } from 'zod';
import { freelanceFormSchema } from './schemas/freelanceFormSchema';

export type FreelanceFormData = z.infer<typeof freelanceFormSchema>;
