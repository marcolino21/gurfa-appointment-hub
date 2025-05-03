import { z } from 'zod';

export const blockTimeSchema = z.object({
  staffId: z.string(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato orario richiesto: HH:MM"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato orario richiesto: HH:MM"),
  blockType: z.enum(['today', 'period']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  reason: z.string().optional()
}).refine(data => {
  if (data.blockType === 'period') {
    return data.startDate && data.endDate;
  }
  return true;
}, {
  message: "Per il blocco periodico sono richiesti sia la data di inizio che di fine",
  path: ["startDate", "endDate"]
}); 